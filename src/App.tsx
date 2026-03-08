import React, { useState, useEffect, useRef, useMemo } from 'react'
import { SYSTEM_CONFIG } from './config'

type PageID = 'MAIN' | keyof typeof SYSTEM_CONFIG.PAGES

interface ListingItem {
  date: string
  type: string
  name: string
  id?: PageID
  url?: string
}

function App() {
  // --- STATE ---
  const [bootStep, setBootStep] = useState<number>(0)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<PageID>('MAIN')
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [commandInput, setCommandInput] = useState<string>('')
  const [suggestion, setSuggestion] = useState<string>('')
  const [errorLine, setErrorLine] = useState<string>('')
  
  const inputRef = useRef<HTMLInputElement>(null)

  // --- DERIVED DATA ---
  const currentItems = useMemo((): ListingItem[] => {
    if (currentPage === 'MAIN') {
      return [...SYSTEM_CONFIG.COMMANDS] as ListingItem[]
    }
    
    const pageItems = SYSTEM_CONFIG.PAGES[currentPage]
    // Add ".." navigation to sub-pages
    return [{ date: '03/08/2026', type: '<DIR>', name: '..' }, ...pageItems] as ListingItem[]
  }, [currentPage])

  const availableCommands = useMemo(() => {
    const names = currentItems.map(item => item.name.toUpperCase())
    if (currentPage !== 'MAIN') {
      names.push('CD ..', '..')
    }
    return names
  }, [currentItems, currentPage])

  // --- EFFECTS ---
  
  // Apply Config Colors to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--terminal-green', SYSTEM_CONFIG.COLORS.PRIMARY);
    root.style.setProperty('--terminal-dim', SYSTEM_CONFIG.COLORS.DIMMED);
    root.style.setProperty('--terminal-bg', SYSTEM_CONFIG.COLORS.BACKGROUND);
  }, []);

  // BIOS Boot Sequence
  useEffect(() => {
    if (bootStep < 5) {
      const { BOOT_STEP_MIN, BOOT_STEP_MAX } = SYSTEM_CONFIG.SPEEDS
      const timer = setTimeout(() => setBootStep(bootStep + 1), 
        BOOT_STEP_MIN + Math.random() * (BOOT_STEP_MAX - BOOT_STEP_MIN))
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setIsReady(true), SYSTEM_CONFIG.SPEEDS.BOOT_READY_DELAY)
      return () => clearTimeout(timer)
    }
  }, [bootStep])

  // Sequential Page Loading (Line-by-line)
  useEffect(() => {
    if (isReady) {
      setVisibleLines(0)
      const timer = setInterval(() => {
        setVisibleLines(prev => {
          if (prev < currentItems.length + 1) { // +1 for the header
            return prev + 1
          }
          clearInterval(timer)
          return prev
        })
      }, SYSTEM_CONFIG.SPEEDS.PAGE_LINE_LOAD)
      return () => clearInterval(timer)
    }
  }, [isReady, currentPage, currentItems.length])

  // Focus input on ready
  useEffect(() => {
    if (isReady && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isReady, currentPage])

  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setCommandInput(val)
    setErrorLine('')

    if (val.length > 0) {
      const found = availableCommands.find(cmd => cmd.startsWith(val))
      setSuggestion(found ? found : '')
    } else {
      setSuggestion('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestion) {
        setCommandInput(suggestion)
        setSuggestion('')
      }
    } else if (e.key === 'Enter') {
      executeCommand(commandInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : currentItems.length - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < currentItems.length - 1 ? prev + 1 : 0))
    }
  }

  const executeCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toUpperCase()
    
    // Check for ".." or "CD .."
    if (cleanCmd === '..' || cleanCmd === 'CD ..') {
      if (currentPage !== 'MAIN') {
        setCurrentPage('MAIN')
        setSelectedIndex(0)
        setCommandInput('')
        setSuggestion('')
        return
      }
    }

    // Find the item by name
    const targetItem = currentItems.find(item => item.name.toUpperCase() === cleanCmd)

    if (targetItem) {
      if (targetItem.name === '..') {
        setCurrentPage('MAIN')
        setSelectedIndex(0)
      } else if (targetItem.url) {
        window.open(targetItem.url, '_blank')
      } else if (targetItem.id) {
        setCurrentPage(targetItem.id)
        setSelectedIndex(0)
      }
      setCommandInput('')
      setSuggestion('')
    } else if (cleanCmd.length > 0) {
      setErrorLine('BAD COMMAND OR FILE NAME')
      setCommandInput('')
      setSuggestion('')
    }
  }

  const handleOptionClick = (index: number) => {
    setSelectedIndex(index)
    const item = currentItems[index]
    executeCommand(item.name)
  }

  // --- RENDER HELPERS ---

  const renderTableHead = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 1fr', marginBottom: '0.5rem', borderBottom: '1px dashed var(--terminal-dim)', paddingBottom: '2px' }} className="dim">
      <span>DATE</span>
      <span>TYPE</span>
      <span>NAME</span>
    </div>
  )

  const renderRow = (item: ListingItem, index: number) => (
    <div 
      key={`${item.name}-${index}`}
      onClick={() => handleOptionClick(index)}
      style={{ 
        display: 'grid', 
        gridTemplateColumns: '150px 100px 1fr',
        cursor: 'pointer',
        backgroundColor: selectedIndex === index ? 'var(--terminal-green)' : 'transparent',
        color: selectedIndex === index ? 'var(--terminal-bg)' : 'var(--terminal-green)',
        padding: '2px 0'
      }}
    >
      <span>{item.date}</span>
      <span>{item.type}</span>
      <span>{item.name}</span>
    </div>
  )

  return (
    <div className="monitor">
      {!isReady ? (
        <section className="bios">
          <div>WOUFF SYSTEM BIOS v1.0</div>
          <div>(C) 2026 WOUFF. ALL RIGHTS RESERVED.</div>
          {bootStep > 0 && <div>CPU: POTEAR v0.1 @ 4.2GHz</div>}
          {bootStep > 1 && <div>MEMORY: 640KB OK</div>}
          {bootStep > 2 && <div style={{ marginTop: '1rem' }}>SEARCHING FOR DISK... OK</div>}
          {bootStep > 3 && <div>BOOTING FROM C:\\WOUFF... DONE</div>}
        </section>
      ) : (
        <div className="terminal-content">
          <header className="ascii-header">
            {SYSTEM_CONFIG.HEADER.TEXT}
          </header>

          <div className="directory-listing" style={{ marginTop: '1rem' }}>
            <div className="dim" style={{ marginBottom: '1rem' }}>
              Volume in drive C is WOUFF_ROOT<br/>
              Directory of C:\{currentPage === 'MAIN' ? 'WOUFF' : currentPage}
            </div>

            {visibleLines > 0 && renderTableHead()}
            
            {currentItems.map((item, idx) => {
              if (idx < visibleLines - 1) {
                return renderRow(item, idx)
              }
              return null
            })}
          </div>

          <footer style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            {errorLine && <div style={{ marginBottom: '0.5rem' }}>{errorLine}</div>}
            <div className="prompt-line" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <span>C:\{currentPage === 'MAIN' ? 'WOUFF' : currentPage}&gt;&nbsp;</span>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoFocus
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--terminal-green)',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    outline: 'none',
                    width: '100%',
                    caretColor: 'var(--terminal-green)',
                    position: 'relative',
                    zIndex: 2
                  }}
                />
                {suggestion && commandInput && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    color: 'var(--terminal-dim)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>
                    {commandInput}<span className="dim">{suggestion.slice(commandInput.length)}</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--terminal-dim)', paddingTop: '0.5rem', fontSize: '1rem' }} className="dim">
              {SYSTEM_CONFIG.FOOTER.COPYRIGHT}
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}

export default App
