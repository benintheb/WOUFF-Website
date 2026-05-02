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

const MarqueeText = ({ text, isSelected }: { text: string, isSelected: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [scrollAmount, setScrollAmount] = useState('0px');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        const contentWidth = containerRef.current.scrollWidth;
        if (contentWidth > parentWidth) {
          setOverflows(true);
          setScrollAmount(`-${contentWidth - parentWidth + 30}px`);
        } else {
          setOverflows(false);
        }
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [text]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    
    if (isSelected && overflows) {
      timeoutId = setTimeout(() => {
        setIsScrolled(true);
        intervalId = setInterval(() => {
          setIsScrolled(prev => !prev);
        }, 3000);
      }, 500);
    } else {
      setIsScrolled(false);
    }
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isSelected, overflows]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        overflow: 'hidden', 
        whiteSpace: 'nowrap', 
        width: '100%',
        textOverflow: (!isSelected) ? 'ellipsis' : 'clip' 
      }}
    >
      <span 
        style={{ 
          display: (isSelected && overflows) ? 'inline-block' : 'inline',
          transform: isScrolled ? `translateX(${scrollAmount})` : 'translateX(0)',
          transition: (isSelected && overflows) ? 'transform 2.5s ease-in-out' : 'none'
        }}
      >
        {text}
      </span>
    </div>
  )
}

function App() {
  // --- STATE ---
  const [bootStep, setBootStep] = useState<number>(0)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<PageID>('MAIN')
  const [prevPage, setPrevPage] = useState<PageID | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [commandInput, setCommandInput] = useState<string>('')
  const [suggestion, setSuggestion] = useState<string>('')
  const [errorLine, setErrorLine] = useState<string>('')
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string>('')
  const [loadTrigger, setLoadTrigger] = useState<number>(0)
  const [forceFullLoad, setForceFullLoad] = useState<boolean>(false)
  
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
  const isSpecializedPage = currentPage !== 'MAIN' && currentPage !== 'SNS_LINKS' && currentPage !== 'STREAMING_PLATFORMS';
  const isLinksPage = currentPage === 'SNS_LINKS' || currentPage === 'STREAMING_PLATFORMS';
  const isMainPage = currentPage === 'MAIN';

  // Determine if we should perform a "Minimal Motion" load
  const isMinimalLoad = useMemo(() => {
    if (forceFullLoad) return false;
    if (prevPage === null) return false;
    const fromList = prevPage === 'MAIN' || prevPage === 'SNS_LINKS' || prevPage === 'STREAMING_PLATFORMS';
    const toList = currentPage === 'MAIN' || currentPage === 'SNS_LINKS' || currentPage === 'STREAMING_PLATFORMS';
    return fromList && toList;
  }, [prevPage, currentPage, forceFullLoad]);

  const currentItems = useMemo((): ListingItem[] => {
    if (isMainPage) {
      return [...SYSTEM_CONFIG.COMMANDS] as ListingItem[]
    }
    
    const pageItems = (SYSTEM_CONFIG.PAGES as any)[currentPage] || []
    return [
      { 
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }), 
        type: SYSTEM_CONFIG.SYSTEM.BACK_DIR_TYPE, 
        name: SYSTEM_CONFIG.SYSTEM.BACK_DIR_NAME 
      }, 
      ...pageItems
    ] as ListingItem[]
  }, [currentPage, isMainPage])

  const availableCommands = useMemo(() => {
    const names = currentItems.map(item => item.name.toUpperCase())
    if (!isMainPage) {
      const backCmd = SYSTEM_CONFIG.SYSTEM.BACK_DIR_NAME.toUpperCase()
      names.push(`CD ${backCmd}`, backCmd)
    }
    return names
  }, [currentItems, isMainPage])

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

    // Capture load type at effect start to prevent double triggers
    const currentIsMinimal = isMinimalLoad;

    // Reset visibility logic based on load type
    if (currentIsMinimal) {
      setVisibleContentLines(0);
      setVisibleHeaderLines(headerLines.length);
      setIsInfoVisible(true);
      setIsPromptVisible(true);
      setIsFooterVisible(true);
    } else {
      setVisibleHeaderLines(0);
      setIsInfoVisible(false);
      setVisibleContentLines(0);
      setIsPromptVisible(false);
      setIsFooterVisible(false);
    }

    let headerPtr = currentIsMinimal ? headerLines.length : 0;
    let contentPtr = 0;
    let infoShown = currentIsMinimal;
    let promptShown = currentIsMinimal;
    let footerShown = currentIsMinimal;

    const interval = SYSTEM_CONFIG.SPEEDS.PAGE_LINE_LOAD;

    const sequenceTimer = setInterval(() => {
      if (!isSpecializedPage && headerPtr < headerLines.length) {
        headerPtr++;
        setVisibleHeaderLines(headerPtr);
        return;
      }

      if (!infoShown) {
        infoShown = true;
        setIsInfoVisible(true);
        return;
      }

      if (contentPtr < currentItems.length + 1) {
        contentPtr++;
        setVisibleContentLines(contentPtr);
        return;
      }

      if (!promptShown) {
        promptShown = true;
        setIsPromptVisible(true);
        return;
      }

      if (!footerShown) {
        footerShown = true;
        setIsFooterVisible(true);
        clearInterval(sequenceTimer);
        if (forceFullLoad) setForceFullLoad(false);
        return;
      }

      if (currentIsMinimal && contentPtr >= currentItems.length + 1) {
        clearInterval(sequenceTimer);
        if (forceFullLoad) setForceFullLoad(false);
      }
    }, interval);

    return () => {
      clearInterval(sequenceTimer);
    };
  }, [isReady, currentPage, isSpecializedPage, currentItems.length, headerLines.length, loadTrigger]);

  // Focus input
  useEffect(() => {
    if (isPromptVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isPromptVisible])

  // Global Key Listeners (ESC for Navigation)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isMainPage) {
          changePage('MAIN')
        } else if (isReady) {
          // Soft reload from home page
          setLoadTrigger(prev => prev + 1)
        }
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isMainPage, isReady])

  // Mock API Fetching Simulation
  useEffect(() => {
    if (isReady && (currentPage === 'LATEST_MEDIA.MOV' || currentPage === 'DISCOGRAPHY.EXE')) {
      // Architecture for future real API integration
      const timer = setTimeout(() => {
        // Here we would normally update state with fetched data
        console.log(`[SYS] Automated fetch triggered for ${currentPage}`)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isReady, currentPage])

  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase()
    setCommandInput(val)

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
    const promptBack = 'BACK'
    
    if (cleanCmd === promptBack) {
      if (isMainPage) {
        setErrorLine('ALREADY IN WOUFF_ROOT')
        setCommandInput('')
        setSuggestion('')
        return
      } else {
        changePage('MAIN')
        return
      }
    }

    if (cleanCmd === backCmd || cleanCmd === `CD ${backCmd}`) {
      if (!isMainPage) {
        changePage('MAIN')
        return
      }
    }

    const targetItem = currentItems.find(item => item.name.toUpperCase() === cleanCmd)

    if (targetItem) {
      // Do not show command history for SNS/External links
      if (!targetItem.url) {
        setLastExecutedCommand(cleanCmd)
      }
      
      setErrorLine('')
      if (targetItem.name === SYSTEM_CONFIG.SYSTEM.BACK_DIR_NAME) {
        changePage('MAIN')
      } else if (targetItem.url) {
        if (targetItem.url !== '#') {
          window.open(targetItem.url, '_blank')
        }
        // If URL is '#', it represents a non-functional link as per V5 plan
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
    setPrevPage(currentPage)
    setCurrentPage(id)
    setSelectedIndex(0)
    setLastExecutedCommand('')
    setErrorLine('')
    setCommandInput('')
    setSuggestion('')
    setLoadTrigger(prev => prev + 1)
  }

  const handlePathSegmentClick = (id: PageID) => {
    if (currentPage === id) {
      if (id === 'MAIN') {
        setForceFullLoad(true);
      }
      setLoadTrigger(prev => prev + 1)
    } else {
      changePage(id)
    }
  }

  // --- RENDER HELPERS ---



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
        {!isMainPage && (
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
    if (currentPage === 'LATEST_MEDIA.MOV') {
      return (
        <div className="specialized-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--terminal-green)', padding: '1rem', margin: '0.5rem 0', overflow: 'hidden' }}>
          <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/Zz7PLwoX9_4?autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <div style={{ marginTop: '0.5rem' }} className="dim">LATEST_MEDIA.MOV - PLAYING</div>
        </div>
      )
    }
    if (currentPage === 'ABOUT_POTEAR.TXT' || currentPage === 'ABOUT_WOUFF.TXT') {
      return (
        <div className="specialized-container" style={{ flex: 1, border: '2px solid var(--terminal-green)', padding: '1.5rem', margin: '0.5rem 0', overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: 'inherit', lineHeight: '1.4' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--terminal-green)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            --- TEXT VIEWER ---
          </div>
          {currentItems.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '0.4rem', opacity: idx < visibleContentLines ? 1 : 0 }}>{item.name}</div>
          ))}
        </div>
      )
    }
    if (currentPage === 'DISCOGRAPHY.EXE') {
      return (
        <div className="specialized-container" style={{ flex: 1, border: '2px solid var(--terminal-green)', padding: '1rem', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid var(--terminal-green)', marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>EXECUTING DISCOGRAPHY.EXE...</div>
          <div className="disco-grid">
            {currentItems.filter(item => item.name !== '..').slice(0, 6).map((item, idx) => (
              <div key={idx} className="disco-item" style={{ border: '1px dashed var(--terminal-dim)', padding: '0.5rem', opacity: idx < visibleContentLines ? 1 : 0, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {(item as any).image ? (
                    <img src={(item as any).image} alt={item.name} style={{ width: '100%', maxWidth: '100px', margin: '0 auto 0.3rem auto', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', maxWidth: '100px', margin: '0 auto 0.3rem auto', aspectRatio: '1/1', background: '#222' }} />
                  )}
                  <div style={{ fontSize: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <div className="dim" style={{ fontSize: 'inherit' }}>({item.date})</div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null;
  }

  return (
    <div className="monitor">
      {!isReady ? (
        <div className="terminal-content">
          <section className="bios">
            <div>{SYSTEM_CONFIG.BIOS.TITLE}</div>
            <div>{SYSTEM_CONFIG.BIOS.COPYRIGHT}</div>
            {bootStep > 0 && <div>{SYSTEM_CONFIG.BIOS.CPU_INFO}</div>}
            {bootStep > 1 && <div>{SYSTEM_CONFIG.BIOS.MEMORY_INFO}</div>}
            {bootStep > 2 && <div style={{ marginTop: '1rem' }}>{SYSTEM_CONFIG.BIOS.DISK_SEARCH}</div>}
            {bootStep > 3 && <div>{SYSTEM_CONFIG.BIOS.BOOT_MESSAGE}</div>}
          </section>
        </div>
      ) : (
        <div className="terminal-content">
          {!isSpecializedPage && (
            <header className="ascii-header">
              {headerLines.map((line, idx) => (
                <div key={idx} style={{ opacity: idx < visibleHeaderLines ? 1 : 0 }}>{line}</div>
              ))}
            </header>
          )}

          <div className="directory-container" style={{ opacity: isInfoVisible ? 1 : 0 }}>
            {isSpecializedPage ? renderSpecializedContent() : (
              <div className="directory-listing">
                <div className="dim" style={{ marginBottom: '0.5rem' }}>
                  {SYSTEM_CONFIG.SYSTEM.VOLUME_LABEL}<br/>
                  {SYSTEM_CONFIG.UI_TEXT.DIRECTORY_OF}{renderBreadcrumbs()}
                </div>

                <div style={{ width: '100%' }}>
                  {visibleContentLines > 0 && (
                    <div className="dim" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr minmax(0, 1fr)', 
                      marginBottom: '0.5rem', 
                      borderBottom: '1px dashed var(--terminal-dim)', 
                      paddingBottom: '2px',
                      paddingLeft: '4px'
                    }}>
                      <span>{SYSTEM_CONFIG.UI_TEXT.TABLE_HEADER_DATE}</span>
                      <span>{SYSTEM_CONFIG.UI_TEXT.TABLE_HEADER_TYPE}</span>
                      <span>{SYSTEM_CONFIG.UI_TEXT.TABLE_HEADER_NAME}</span>
                    </div>
                  )}
                  {currentItems.map((item, idx) => {
                    if (idx < visibleContentLines - 1) {
                      const isSelected = selectedIndex === idx;
                      const bg = isSelected ? 'var(--terminal-green)' : 'transparent';
                      const color = isSelected ? 'var(--terminal-bg)' : 'var(--terminal-green)';
                      return (
                        <div 
                          key={`${item.name}-${idx}`}
                          onMouseEnter={() => {
                            const isHoverDevice = window.matchMedia('(hover: hover)').matches;
                            if (isHoverDevice) setSelectedIndex(idx);
                          }}
                          onClick={() => {
                            const isHoverDevice = window.matchMedia('(hover: hover)').matches;
                            if (isHoverDevice) {
                              executeCommand(item.name);
                            } else {
                              if (selectedIndex === idx) {
                                executeCommand(item.name);
                              } else {
                                setSelectedIndex(idx);
                              }
                            }
                          }}
                          style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr minmax(0, 1fr)',
                            cursor: 'pointer',
                            backgroundColor: bg,
                            color: color,
                            padding: '2px 0 2px 4px'
                          }}
                        >
                          <span style={{ paddingRight: '1rem', whiteSpace: 'nowrap' }}>{item.date}</span>
                          <span style={{ paddingRight: '1rem', whiteSpace: 'nowrap' }}>{item.type}</span>
                          <MarqueeText text={item.name} isSelected={isSelected} />
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            )}
          </div>

          <footer className="terminal-footer" style={{ opacity: isPromptVisible ? 1 : 0 }}>
            {lastExecutedCommand && (
              <div className="dim" style={{ marginBottom: '0.1rem' }}>
                {renderBreadcrumbs()}{SYSTEM_CONFIG.SYSTEM.PROMPT_SYMBOL} {lastExecutedCommand}
              </div>
            )}
            
            {errorLine && (
              <div className="dim" style={{ marginBottom: '0.2rem', color: 'var(--terminal-dim)' }}>
                {errorLine}
              </div>
            )}
            
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
                  inputMode={isLinksPage || isSpecializedPage ? 'none' : 'text'}
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
              marginTop: '0.5rem', 
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
