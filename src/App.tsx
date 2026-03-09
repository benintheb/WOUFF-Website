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
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [commandInput, setCommandInput] = useState<string>('')
  const [suggestion, setSuggestion] = useState<string>('')
  const [errorLine, setErrorLine] = useState<string>('')
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string>('')
  const [loadTrigger, setLoadTrigger] = useState<number>(0)
  
  // Animation state for sequential loading
  const [visibleHeaderLines, setVisibleHeaderLines] = useState<number>(0)
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false)
  const [visibleContentLines, setVisibleContentLines] = useState<number>(0)
  const [isPromptVisible, setIsPromptVisible] = useState<boolean>(false)
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Split header into lines for animation
  const headerLines = useMemo(() => SYSTEM_CONFIG.HEADER.TEXT.split('\n'), [])

  // --- DERIVED DATA ---
  const isSpecializedPage = currentPage !== 'MAIN' && currentPage !== 'LINKS';

  const currentItems = useMemo((): ListingItem[] => {
    if (currentPage === 'MAIN') {
      return [...SYSTEM_CONFIG.COMMANDS] as ListingItem[]
    }
    
    const pageItems = SYSTEM_CONFIG.PAGES[currentPage]
    return [
      { 
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }), 
        type: SYSTEM_CONFIG.SYSTEM.BACK_DIR_TYPE, 
        name: SYSTEM_CONFIG.SYSTEM.BACK_DIR_NAME 
      }, 
      ...pageItems
    ] as ListingItem[]
  }, [currentPage])

  const availableCommands = useMemo(() => {
    const names = currentItems.map(item => item.name.toUpperCase())
    if (currentPage !== 'MAIN') {
      const backCmd = SYSTEM_CONFIG.SYSTEM.BACK_DIR_NAME.toUpperCase()
      names.push(`CD ${backCmd}`, backCmd)
    }
    return names
  }, [currentItems, currentPage])

  // --- EFFECTS ---
  
  // Metadata & Visuals
  useEffect(() => {
    document.title = SYSTEM_CONFIG.METADATA.TITLE;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', SYSTEM_CONFIG.METADATA.DESCRIPTION);
    
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = SYSTEM_CONFIG.METADATA.FAVICON;

    const root = document.documentElement;
    root.style.setProperty('--terminal-green', SYSTEM_CONFIG.COLORS.PRIMARY);
    root.style.setProperty('--terminal-dim', SYSTEM_CONFIG.COLORS.DIMMED);
    root.style.setProperty('--terminal-bg', SYSTEM_CONFIG.COLORS.BACKGROUND);
    root.style.setProperty('--font-family', SYSTEM_CONFIG.VISUALS.FONT_FAMILY);
    root.style.setProperty('--scanline-opacity', SYSTEM_CONFIG.VISUALS.SCANLINE_OPACITY.toString());
    root.style.setProperty('--glow-intensity', SYSTEM_CONFIG.VISUALS.GLOW_INTENSITY);
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

  // Top-to-Bottom Sequential Loading Logic
  useEffect(() => {
    if (!isReady) return;

    // Reset visibility
    setVisibleHeaderLines(0)
    setIsInfoVisible(false)
    setVisibleContentLines(0)
    setIsPromptVisible(false)
    setIsFooterVisible(false)

    let currentStep = 0;
    const interval = SYSTEM_CONFIG.SPEEDS.PAGE_LINE_LOAD;

    const sequenceTimer = setInterval(() => {
      // 1. Header (only for non-specialized pages)
      if (!isSpecializedPage && currentStep < headerLines.length) {
        setVisibleHeaderLines(prev => prev + 1);
        currentStep++;
        return;
      }

      // 2. Directory Info
      if (!isInfoVisible) {
        setIsInfoVisible(true);
        return;
      }

      // 3. Content Listing / Specialized Content
      if (visibleContentLines < currentItems.length + 1) {
        setVisibleContentLines(prev => prev + 1);
        return;
      }

      // 4. Prompt
      if (!isPromptVisible) {
        setIsPromptVisible(true);
        return;
      }

      // 5. Footer
      if (!isFooterVisible) {
        setIsFooterVisible(true);
        clearInterval(sequenceTimer);
        return;
      }
    }, interval);

    return () => clearInterval(sequenceTimer);
  }, [isReady, currentPage, isSpecializedPage, currentItems.length, headerLines.length, loadTrigger]);

  // Focus input
  useEffect(() => {
    if (isPromptVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isPromptVisible])

  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setCommandInput(val)
    // Error persists during typing as per Version 4 plan

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
      if (commandInput.trim().length === 0) {
        const selectedItem = currentItems[selectedIndex]
        if (selectedItem) executeCommand(selectedItem.name)
      } else {
        executeCommand(commandInput)
      }
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
    const backCmd = SYSTEM_CONFIG.SYSTEM.BACK_DIR_NAME.toUpperCase()
    
    if (cleanCmd === backCmd || cleanCmd === `CD ${backCmd}`) {
      if (currentPage !== 'MAIN') {
        changePage('MAIN')
        return
      }
    }

    const targetItem = currentItems.find(item => item.name.toUpperCase() === cleanCmd)

    if (targetItem) {
      setLastExecutedCommand(cleanCmd)
      setErrorLine('')
      if (targetItem.name === SYSTEM_CONFIG.SYSTEM.BACK_DIR_NAME) {
        changePage('MAIN')
      } else if (targetItem.url) {
        window.open(targetItem.url, '_blank')
      } else if (targetItem.id) {
        changePage(targetItem.id)
      }
      setCommandInput('')
      setSuggestion('')
    } else if (cleanCmd.length > 0) {
      setErrorLine(cleanCmd + SYSTEM_CONFIG.UI_TEXT.ERROR_TEMPLATE)
      setCommandInput('')
      setSuggestion('')
    }
  }

  const changePage = (id: PageID) => {
    setCurrentPage(id)
    setSelectedIndex(0)
    setLastExecutedCommand('')
    setErrorLine('')
    setCommandInput('')
    setSuggestion('')
    // Trigger reload animation
    setLoadTrigger(prev => prev + 1)
  }

  const handlePathSegmentClick = (id: PageID) => {
    if (currentPage === id) {
      // Reload current page animation
      setLoadTrigger(prev => prev + 1)
    } else {
      changePage(id)
    }
  }

  // --- RENDER HELPERS ---

  const renderTableHead = () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `${SYSTEM_CONFIG.VISUALS.LAYOUT.DATE_COL_WIDTH} ${SYSTEM_CONFIG.VISUALS.LAYOUT.TYPE_COL_WIDTH} ${SYSTEM_CONFIG.VISUALS.LAYOUT.NAME_COL_WIDTH}`, 
      marginBottom: '0.5rem', 
      borderBottom: '1px dashed var(--terminal-dim)', 
      paddingBottom: '2px' 
    }} className="dim">
      <span>{SYSTEM_CONFIG.UI_TEXT.TABLE_HEADER_DATE}</span>
      <span>{SYSTEM_CONFIG.UI_TEXT.TABLE_HEADER_TYPE}</span>
      <span>{SYSTEM_CONFIG.UI_TEXT.TABLE_HEADER_NAME}</span>
    </div>
  )

  const renderRow = (item: ListingItem, index: number) => {
    const isSelected = selectedIndex === index;
    return (
      <div 
        key={`${item.name}-${index}`}
        onMouseEnter={() => setSelectedIndex(index)}
        onClick={() => executeCommand(item.name)}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `${SYSTEM_CONFIG.VISUALS.LAYOUT.DATE_COL_WIDTH} ${SYSTEM_CONFIG.VISUALS.LAYOUT.TYPE_COL_WIDTH} ${SYSTEM_CONFIG.VISUALS.LAYOUT.NAME_COL_WIDTH}`,
          cursor: 'pointer',
          backgroundColor: isSelected ? 'var(--terminal-green)' : 'transparent',
          color: isSelected ? 'var(--terminal-bg)' : 'var(--terminal-green)',
          padding: '2px 0'
        }}
      >
        <span>{item.date}</span>
        <span>{item.type}</span>
        <span>{item.name}</span>
      </div>
    )
  }

  const renderBreadcrumbs = () => {
    const rootPath = SYSTEM_CONFIG.SYSTEM.DRIVE_LETTER + '\\' + SYSTEM_CONFIG.SYSTEM.ROOT_PATH
    return (
      <span className="breadcrumbs">
        <span 
          onClick={() => handlePathSegmentClick('MAIN')}
          className="breadcrumb-segment"
          style={{ cursor: 'pointer', padding: '0 4px' }}
        >
          {rootPath}
        </span>
        {currentPage !== 'MAIN' && (
          <>
            <span>\</span>
            <span 
              onClick={() => handlePathSegmentClick(currentPage)}
              className="breadcrumb-segment"
              style={{ cursor: 'pointer', padding: '0 4px' }}
            >
              {currentPage}
            </span>
          </>
        )}
      </span>
    )
  }

  const renderSpecializedContent = () => {
    if (currentPage.includes('MEDIA')) {
      return (
        <div className="specialized-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--terminal-green)', padding: '1rem', margin: '1rem 0' }}>
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            [ MOVIE PLAYER PLACEHOLDER ]
          </div>
          <div style={{ marginTop: '1rem' }} className="dim">LATEST_MEDIA.MOV - PLAYING</div>
        </div>
      )
    }
    if (currentPage.includes('ABOUT')) {
      return (
        <div className="specialized-container" style={{ flex: 1, border: '2px solid var(--terminal-green)', padding: '2rem', margin: '1rem 0', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--terminal-green)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            --- TEXT VIEWER ---
          </div>
          {currentItems.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '0.5rem', opacity: idx < visibleContentLines ? 1 : 0 }}>{item.name}</div>
          ))}
        </div>
      )
    }
    if (currentPage.includes('DISCO')) {
      return (
        <div className="specialized-container" style={{ flex: 1, border: '2px solid var(--terminal-green)', padding: '2rem', margin: '1rem 0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderBottom: '1px solid var(--terminal-green)', marginBottom: '1rem' }}>EXECUTING DISCOGRAPHY.EXE...</div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ border: '1px dashed var(--terminal-dim)', padding: '1rem', opacity: visibleContentLines > 1 ? 1 : 0 }}>[ ALBUM_01 ]</div>
            <div style={{ border: '1px dashed var(--terminal-dim)', padding: '1rem', opacity: visibleContentLines > 2 ? 1 : 0 }}>[ ALBUM_02 ]</div>
            <div style={{ border: '1px dashed var(--terminal-dim)', padding: '1rem', opacity: visibleContentLines > 3 ? 1 : 0 }}>[ ALBUM_03 ]</div>
          </div>
        </div>
      )
    }
    return null;
  }

  return (
    <div className="monitor">
      {!isReady ? (
        <section className="bios">
          <div>{SYSTEM_CONFIG.BIOS.TITLE}</div>
          <div>{SYSTEM_CONFIG.BIOS.COPYRIGHT}</div>
          {bootStep > 0 && <div>{SYSTEM_CONFIG.BIOS.CPU_INFO}</div>}
          {bootStep > 1 && <div>{SYSTEM_CONFIG.BIOS.MEMORY_INFO}</div>}
          {bootStep > 2 && <div style={{ marginTop: '1rem' }}>{SYSTEM_CONFIG.BIOS.DISK_SEARCH}</div>}
          {bootStep > 3 && <div>{SYSTEM_CONFIG.BIOS.BOOT_MESSAGE}</div>}
        </section>
      ) : (
        <div className="terminal-content">
          {!isSpecializedPage && (
            <header className="ascii-header">
              {headerLines.map((line, idx) => (
                <div key={idx} style={{ opacity: idx < visibleHeaderLines ? 1 : 0 }}>{line}</div>
              ))}
            </header>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', opacity: isInfoVisible ? 1 : 0 }}>
            {isSpecializedPage ? renderSpecializedContent() : (
              <div className="directory-listing" style={{ marginTop: '1rem' }}>
                <div className="dim" style={{ marginBottom: '1rem' }}>
                  {SYSTEM_CONFIG.SYSTEM.VOLUME_LABEL}<br/>
                  {SYSTEM_CONFIG.UI_TEXT.DIRECTORY_OF}{renderBreadcrumbs()}
                </div>

                {visibleContentLines > 0 && renderTableHead()}
                
                {currentItems.map((item, idx) => {
                  if (idx < visibleContentLines - 1) {
                    return renderRow(item, idx)
                  }
                  return null
                })}
              </div>
            )}
          </div>

          <footer style={{ marginTop: 'auto', paddingTop: '2rem', opacity: isPromptVisible ? 1 : 0 }}>
            {lastExecutedCommand && (
              <div className="dim" style={{ marginBottom: '0.2rem' }}>
                {renderBreadcrumbs()}{SYSTEM_CONFIG.SYSTEM.PROMPT_SYMBOL} {lastExecutedCommand}
              </div>
            )}
            
            {errorLine && (
              <div className="dim" style={{ marginBottom: '0.5rem', color: 'var(--terminal-dim)' }}>
                {SYSTEM_CONFIG.SYSTEM.DRIVE_LETTER}\WOUFF{SYSTEM_CONFIG.SYSTEM.PROMPT_SYMBOL} {errorLine}
              </div>
            )}
            
            <div style={{ marginBottom: '1rem' }} />

            <div className="prompt-line" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <span>{renderBreadcrumbs()}{SYSTEM_CONFIG.SYSTEM.PROMPT_SYMBOL}&nbsp;</span>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoFocus
                  inputMode={currentPage === 'LINKS' || isSpecializedPage ? 'none' : 'text'}
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
                    zIndex: 2,
                    textShadow: 'var(--glow-intensity)'
                  }}
                />
                {suggestion && commandInput && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    color: 'var(--terminal-dim)',
                    pointerEvents: 'none',
                    zIndex: 1,
                    textShadow: 'var(--glow-intensity)'
                  }}>
                    {commandInput}<span className="dim">{suggestion.slice(commandInput.length)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ 
              marginTop: '1rem', 
              borderTop: '1px solid var(--terminal-dim)', 
              paddingTop: '0.5rem', 
              fontSize: '1rem',
              opacity: isFooterVisible ? 1 : 0 
            }} className="dim">
              {SYSTEM_CONFIG.FOOTER.COPYRIGHT}
            </div>
          </footer>
        </div>
      )}
    </div>
  )
}

export default App
