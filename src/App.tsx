import React, { useState, useEffect, useRef } from 'react'

const POTEAR_ASCII = `
 ██████╗  ██████╗ ████████╗███████╗ █████╗ ██████╗ 
 ██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██╔══██╗██╔══██╗
 ██████╔╝██║   ██║   ██║   █████╗  ███████║██████╔╝
 ██╔═══╝ ██║   ██║   ██║   ██╔══╝  ██╔══██║██╔══██╗
 ██║     ╚██████╔╝   ██║   ███████╗██║  ██║██║  ██║
 ╚═╝      ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
`

const COMMANDS = [
  'DIR /LINKS',
  'VIEW LATEST_MEDIA.MP4',
  'LOAD DISCOGRAPHY.EXE',
  'ABOUT POTEAR',
  'ABOUT WOUFF'
]

function App() {
  const [bootStep, setBootStep] = useState<number>(0)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [commandInput, setCommandInput] = useState<string>('')
  const [suggestion, setSuggestion] = useState<string>('')
  const [errorLine, setErrorLine] = useState<string>('')
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (bootStep < 5) {
      const timer = setTimeout(() => setBootStep(bootStep + 1), 200 + Math.random() * 500)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setIsReady(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [bootStep])

  useEffect(() => {
    if (isReady && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isReady])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setCommandInput(val)
    setErrorLine('')

    if (val.length > 0) {
      const found = COMMANDS.find(cmd => cmd.startsWith(val))
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
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : COMMANDS.length - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < COMMANDS.length - 1 ? prev + 1 : 0))
    }
  }

  const executeCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toUpperCase()
    if (COMMANDS.includes(cleanCmd)) {
      // Logic for navigation to specific content pages will go here
      console.log('Executing:', cleanCmd)
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
    executeCommand(COMMANDS[index])
  }

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
            {POTEAR_ASCII}
          </header>

          <nav className="nav-list" style={{ marginTop: '2rem' }}>
            {COMMANDS.map((cmd, idx) => (
              <div 
                key={cmd}
                onClick={() => handleOptionClick(idx)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedIndex === idx ? 'var(--terminal-green)' : 'transparent',
                  color: selectedIndex === idx ? 'var(--terminal-bg)' : 'var(--terminal-green)',
                  padding: '2px 8px',
                  display: 'inline-block',
                  clear: 'both'
                }}
              >
                {cmd}
              </div>
            ))}
          </nav>

          <footer style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            {errorLine && <div style={{ marginBottom: '0.5rem' }}>{errorLine}</div>}
            <div className="prompt-line" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <span>C:\\WOUFF&gt;&nbsp;</span>
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
              (C) 2026 WOUFF. ALL RIGHTS RESERVED.
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}

export default App
