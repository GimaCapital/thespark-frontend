import React, { useState, useRef, useCallback, useEffect } from 'react';

const LogoDesigner = () => {
  // State - Using ONLY spark brand colors
  const [brand, setBrand] = useState('TheSpark');
  const [tagline, setTagline] = useState('One spark. One fire. One wealthy Nigeria.');
  const [bgColor, setBgColor] = useState('#FFF7ED');
  const [textColor, setTextColor] = useState('#7C2D12');
  const [shape, setShape] = useState('circle');
  const [iconMode, setIconMode] = useState('emoji');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [downloadSize, setDownloadSize] = useState('256');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showText, setShowText] = useState(true);
  
  // Base sizes at 256x256 (reference size)
  const BASE_SIZE = 256;
  const BASE_ICON_SIZE = 80;
  const BASE_TEXT_SIZE = 32;

  // Preview dimensions
  const [previewWidth, setPreviewWidth] = useState(256);
  const [previewHeight, setPreviewHeight] = useState(256);
  
  // Calculate scale factor based on preview size
  const scaleFactor = Math.min(previewWidth, previewHeight) / BASE_SIZE;
  
  // Dynamic sizes based on EXACT scale
  const iconSize = Math.max(12, Math.round(BASE_ICON_SIZE * scaleFactor));
  const brandSize = Math.max(6, Math.round(BASE_TEXT_SIZE * scaleFactor));
  const taglineSize = Math.max(5, Math.round(13 * scaleFactor));
  
  // Determine if tagline should be hidden (too small to read)
  const showTagline = previewWidth >= 144 && previewHeight >= 144;
  
  // Determine if we should show full brand or abbreviated
  const displayBrand = previewWidth < 100 || previewHeight < 100 ? 'TS' : brand;

  const previewRef = useRef(null);
  const fileInputRef = useRef(null);

  // ONLY your spark brand colors
  const sparkColors = {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  };

  // Manifest icon sizes
  const iconSizes = [
    { label: '72×72 (Favicon)', size: 72 },
    { label: '128×128 (Small)', size: 128 },
    { label: '144×144 (Tablet)', size: 144 },
    { label: '152×152 (Android)', size: 152 },
    { label: '192×192 (PWA)', size: 192 },
    { label: '256×256 (High-res)', size: 256 },
    { label: '512×512 (Store)', size: 512 },
    { label: '1024×1024 (Ultra)', size: 1024 },
  ];

  // Get shape style for preview
  const getShapeStyle = () => {
    switch (shape) {
      case 'circle':
        return '50%';
      case 'square':
        return '0px';
      default:
        return '30px';
    }
  };

  // Get the icon element for preview
  const getIconElement = (size = null) => {
    const currentIconSize = size || Math.min(iconSize, 120);
    if (iconMode === 'emoji') {
      return (
        <span style={{ 
          fontSize: currentIconSize, 
          display: 'block',
          lineHeight: 1,
          filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.3))',
        }}>
          🔥
        </span>
      );
    } else if (uploadedImage) {
      return (
        <img
          src={uploadedImage}
          alt="Logo icon"
          style={{
            width: currentIconSize,
            height: currentIconSize,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      );
    }
    return <span style={{ fontSize: currentIconSize }}>🔥</span>;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setIconMode('upload');
    };
    reader.readAsDataURL(file);
  };

  // Draw logo on canvas with proper positioning matching preview and text wrapping
  const drawLogoOnCanvas = useCallback((canvas, size) => {
    const ctx = canvas.getContext('2d');
    const scale = size / 256;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Calculate dimensions - ZERO PADDING when text is hidden
    const padding = showText ? Math.max(4, size * 0.08) : 0; // ZERO padding!
    const maxWidth = size - (padding * 2);
    const iconSize = Math.max(14, Math.round(80 * scale));
    const brandSize = Math.max(10, Math.round(32 * scale));
    const taglineSize = Math.max(8, Math.round(13 * scale));
    const showTagline = size >= 144;
    const displayBrand = size < 100 ? 'TS' : brand;
    
    // Helper function to wrap text EXACTLY like CSS word-break: break-word
    const wrapText = (text, maxWidth, fontSize, fontWeight = '800') => {
      if (!text) return [];
      
      // Set font for measuring
      ctx.font = `${fontWeight} ${fontSize}px "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
      
      const lines = [];
      const words = text.split(' ');
      let currentLine = '';
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        // Check if this single word is longer than maxWidth
        const wordMetrics = ctx.measureText(word);
        if (wordMetrics.width > maxWidth) {
          // Word is too long - break it character by character
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
          }
          
          // Break the long word
          let remainingWord = word;
          while (remainingWord.length > 0) {
            let charLine = '';
            
            for (let j = 0; j < remainingWord.length; j++) {
              const testChar = remainingWord[j];
              const testLine = charLine + testChar;
              const metrics = ctx.measureText(testLine);
              
              if (metrics.width > maxWidth && charLine.length > 0) {
                lines.push(charLine);
                remainingWord = remainingWord.substring(j);
                charLine = '';
                break;
              } else if (j === remainingWord.length - 1) {
                lines.push(testLine);
                remainingWord = '';
                charLine = '';
                break;
              } else {
                charLine = testLine;
              }
            }
            
            if (charLine && remainingWord.length === 0) {
              lines.push(charLine);
            }
          }
          continue;
        }
        
        // Normal word - try to add it to current line
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    };
    
    // Calculate vertical layout - ICON TAKES 100% when text is hidden
    const iconHeight = showText ? Math.min(iconSize, size * 0.4) : size; // 100% of icon!
    
    // Wrap brand text (only if showing text)
    let brandLines = [];
    let brandTotalHeight = 0;
    let brandLineHeight = 0;
    if (showText) {
      const brandFontSize = Math.min(brandSize, size * 0.2);
      brandLines = wrapText(displayBrand, maxWidth, brandFontSize, '800');
      brandLineHeight = brandFontSize * 1.2;
      brandTotalHeight = brandLines.length * brandLineHeight;
    }
    
    // Wrap tagline text (only if showing text)
    let taglineLines = [];
    let taglineTotalHeight = 0;
    let taglineLineHeight = 0;
    if (showText && showTagline && tagline) {
      const taglineFontSize = Math.min(taglineSize, size * 0.08);
      taglineLines = wrapText(tagline, maxWidth, taglineFontSize, '400');
      taglineLineHeight = taglineFontSize * 1.2;
      taglineTotalHeight = taglineLines.length * taglineLineHeight;
    }
    
    const spacing = showText ? Math.max(2, size * 0.03) : 0;
    const taglineSpacing = showText ? Math.max(2, size * 0.015) : 0;
    
    // Calculate total content height
    let contentHeight = iconHeight;
    if (showText && brand) contentHeight += brandTotalHeight + spacing;
    if (showText && showTagline && tagline && taglineLines.length > 0) {
      contentHeight += taglineTotalHeight + taglineSpacing;
    }
    
    // Start position (centered vertically)
    let currentY = (size - contentHeight) / 2;
    
    // Create clipping path based on shape
    ctx.save();
    
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    } else if (shape === 'rounded') {
      const radius = Math.min(30, size * 0.08);
      const x = 0, y = 0, w = size, h = size;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.clip();
    }
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    
    // 1. Draw icon (centered horizontally) - 100% of icon when text is hidden
    const iconX = size / 2;
    const iconY = currentY + (iconHeight / 2);
    
    if (iconMode === 'emoji') {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Emoji fills 100% when text is hidden
      const emojiFontSize = showText ? Math.min(iconSize, size * 0.4) : size * 0.95;
      ctx.font = `${emojiFontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      
      ctx.shadowColor = 'rgba(249, 115, 22, 0.3)';
      ctx.shadowBlur = size * 0.03;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = size * 0.01;
      
      ctx.fillText('🔥', iconX, iconY);
      ctx.restore();
    } else if (uploadedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = uploadedImage;
      
      return new Promise((resolve) => {
        img.onload = () => {
          const imgSize = showText ? Math.min(iconSize, size * 0.4) : size * 0.95;
          const imgX = (size - imgSize) / 2;
          const imgY = iconY - imgSize/2;
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          resolve();
        };
        img.onerror = () => resolve();
        if (img.complete && img.naturalWidth > 0) {
          const imgSize = showText ? Math.min(iconSize, size * 0.4) : size * 0.95;
          const imgX = (size - imgSize) / 2;
          const imgY = iconY - imgSize/2;
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          resolve();
        }
      });
    }
    
    // Only draw text if showText is true
    if (showText) {
      // Update Y position for brand
      currentY += iconHeight + spacing;
      
      // 2. Draw brand name (with wrapping)
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textColor;
      const brandFontSize = Math.min(brandSize, size * 0.2);
      ctx.font = `800 ${brandFontSize}px "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
      
      brandLines.forEach((line, index) => {
        const lineY = currentY + (index * brandLineHeight) + (brandLineHeight / 2);
        ctx.fillText(line, size/2, lineY);
      });
      ctx.restore();
      
      // Update Y position for tagline
      if (showTagline && tagline && taglineLines.length > 0) {
        currentY += brandTotalHeight + taglineSpacing;
        
        // 3. Draw tagline (with wrapping)
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 0.7;
        const taglineFontSize = Math.min(taglineSize, size * 0.08);
        ctx.font = `400 ${taglineFontSize}px "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
        
        taglineLines.forEach((line, index) => {
          const lineY = currentY + (index * taglineLineHeight) + (taglineLineHeight / 2);
          ctx.fillText(line, size/2, lineY);
        });
        ctx.restore();
      }
    }
    
    ctx.restore();
    
    // For circle, draw anti-aliasing border
    if (shape === 'circle') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2 - 0.5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.strokeStyle = bgColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
    
    return Promise.resolve();
  }, [bgColor, textColor, shape, iconMode, uploadedImage, brand, tagline, showText]);

  // Generate logo - RENDER AT 4x FOR ULTRA SHARPNESS
  const generateLogo = useCallback(async (targetSize) => {
    const renderSize = targetSize * 4;
    const canvas = document.createElement('canvas');
    canvas.width = renderSize;
    canvas.height = renderSize;
    
    await drawLogoOnCanvas(canvas, renderSize);
    
    return canvas.toDataURL('image/png', 1.0);
  }, [drawLogoOnCanvas]);

  // Download single logo using the PREVIEW dimensions
  const downloadLogo = useCallback(async () => {
    setIsDownloading(true);
    
    const targetSize = Math.min(previewWidth, previewHeight);
    
    try {
      const dataUrl = await generateLogo(targetSize);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `thespark-logo-${targetSize}x${targetSize}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Could not download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [previewWidth, previewHeight, generateLogo]);

  // Download ALL sizes
  const downloadAllSizes = useCallback(async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const totalSizes = iconSizes.length;
    let successCount = 0;
    
    for (let i = 0; i < totalSizes; i++) {
      const option = iconSizes[i];
      const size = option.size;
      
      try {
        const dataUrl = await generateLogo(size);
        
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = `thespark-logo-${size}x${size}.png`;
          link.href = dataUrl;
          link.click();
          successCount++;
        }
        
        setDownloadProgress(i + 1);
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (err) {
        console.error(`Failed to download ${size}x${size}:`, err);
      }
    }
    
    setIsDownloading(false);
    setDownloadProgress(0);
    
    if (successCount === totalSizes) {
      alert(`✅ All ${totalSizes} sizes downloaded successfully!`);
    } else {
      alert(`⚠️ Downloaded ${successCount} of ${totalSizes} sizes. Some may have failed.`);
    }
  }, [generateLogo]);

  // Sync preview size with dropdown
  const handleDownloadSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setDownloadSize(e.target.value);
    setPreviewWidth(size);
    setPreviewHeight(size);
  };

  // Switch to emoji mode
  const switchToEmoji = () => {
    setIconMode('emoji');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Switch to upload mode
  const switchToUpload = () => {
    if (!uploadedImage) {
      fileInputRef.current?.click();
    } else {
      setIconMode('upload');
    }
  };

  // Preset color schemes
  const presets = [
    { name: 'Light & Warm', bg: sparkColors[50], text: sparkColors[900] },
    { name: 'Sunset Glow', bg: sparkColors[100], text: sparkColors[800] },
    { name: 'Burnt Orange', bg: sparkColors[200], text: sparkColors[900] },
    { name: 'Bold Orange', bg: sparkColors[500], text: '#FFFFFF' },
    { name: 'Deep & Rich', bg: sparkColors[700], text: '#FFFFFF' },
    { name: 'Dark & Strong', bg: sparkColors[800], text: sparkColors[50] },
  ];

  // Get current size
  const currentSize = Math.min(previewWidth, previewHeight);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <span style={{ ...styles.titleIcon, background: sparkColors[500] }}>🔥</span> TheSpark Logo Designer
      </h1>

      <div style={styles.twoCol}>
        {/* PREVIEW */}
        <div style={styles.previewArea}>
          <div style={styles.previewLabel}>
            📐 Live Preview — {previewWidth}×{previewHeight}
            <span style={{ color: sparkColors[500], fontWeight: 'bold' }}> [{shape}]</span>
            {!showTagline && currentSize < 144 && ' (Tagline hidden)'}
            {previewWidth < 100 && ' (Brand: TS)'}
          </div>

          <div
            ref={previewRef}
            style={{
              ...styles.previewBox,
              backgroundColor: bgColor,
              borderRadius: getShapeStyle(),
              overflow: 'hidden',
              boxShadow: `0 0 0 2px #2a2a2a, 0 10px 40px rgba(249, 115, 22, 0.15)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: showText ? Math.max(2, Math.min(20, previewWidth * 0.08)) : 0,
              width: Math.min(Math.max(previewWidth, 50), 500),
              height: Math.min(Math.max(previewHeight, 50), 500),
              maxWidth: 500,
              maxHeight: 500,
              minWidth: 50,
              minHeight: 50,
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: showText ? Math.max(1, Math.min(8, previewWidth * 0.03)) : 0,
              width: '100%',
              height: showText ? 'auto' : '100%',
            }}>
              {showText ? (
                getIconElement(Math.min(iconSize, 120))
              ) : (
                <span style={{ 
                  fontSize: Math.min(previewWidth * 0.9, previewHeight * 0.9, 500),
                  display: 'block',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 2px 8px rgba(249, 115, 22, 0.3))',
                }}>
                  🔥
                </span>
              )}
            </div>
            {showText && (
              <>
                <div style={{ 
                  fontWeight: 800,
                  color: textColor,
                  fontSize: Math.min(brandSize, 48),
                  textAlign: 'center',
                  width: '100%',
                  padding: '0 2px',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                  fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}>
                  {displayBrand}
                </div>
                {showTagline && tagline && (
                  <div style={{ 
                    fontSize: Math.min(taglineSize, 20),
                    fontWeight: 400,
                    color: textColor,
                    opacity: 0.7,
                    textAlign: 'center',
                    width: '100%',
                    padding: '0 2px',
                    letterSpacing: 0.3,
                    marginTop: Math.max(1, Math.min(4, previewWidth * 0.015)),
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                  }}>
                    {tagline}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Toggle Text Button */}
          <div style={{ width: '100%', marginBottom: 12 }}>
            <button
              onClick={() => setShowText(!showText)}
              style={{
                padding: '8px 16px',
                background: showText ? '#2a2a2a' : sparkColors[500],
                color: showText ? '#aaa' : '#fff',
                border: `2px solid ${showText ? '#3a3a3a' : sparkColors[500]}`,
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s',
                width: '100%',
              }}
            >
              {showText ? '📝 Hide Text (100% Flame)' : '🔥 Show Text (Full Logo)'}
            </button>
            <div style={{ color: '#666', fontSize: 11, marginTop: 4, textAlign: 'center' }}>
              {showText ? 'Current: Full logo with text' : '🔥 Current: 100% flame, ZERO padding!'}
            </div>
          </div>

          {/* Manual Width & Height Inputs */}
          <div style={{ width: '100%', marginBottom: 12 }}>
            <label style={{ color: '#aaa', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              📐 Preview Size (Width × Height)
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={previewWidth}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setPreviewWidth(val);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '1px solid #3a3a3a',
                    borderRadius: 8,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <div style={{ color: '#888', fontSize: 10, marginTop: 2 }}>Width</div>
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  value={previewHeight}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setPreviewHeight(val);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#2a2a2a',
                    color: '#fff',
                    border: '1px solid #3a3a3a',
                    borderRadius: 8,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <div style={{ color: '#888', fontSize: 10, marginTop: 2 }}>Height</div>
              </div>
            </div>
            <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
              🔥 Icon: {showText ? Math.min(iconSize, 120) : '100%'} · 📝 Text: {showText ? Math.min(brandSize, 48) : 'Hidden'} · Scale: {scaleFactor.toFixed(2)}x · Shape: {shape}
              {!showTagline && ' · Tagline hidden'}
              {previewWidth < 100 && ' · Brand: TS'}
              {previewWidth > 500 && ' (Display capped at 500px)'}
            </div>
          </div>

          {/* Download Size Selector */}
          <div style={{ width: '100%', marginBottom: 12 }}>
            <label style={{ color: '#aaa', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              📥 Quick Size Presets
            </label>
            <select
              value={downloadSize}
              onChange={handleDownloadSizeChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#2a2a2a',
                color: '#fff',
                border: '1px solid #3a3a3a',
                borderRadius: 12,
                fontSize: 14,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {iconSizes.map((option) => (
                <option key={option.size} value={option.size}>
                  {option.label}
                </option>
              ))}
            </select>
            <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
              💡 Select a preset or manually adjust Width/Height above
            </div>
          </div>

          {/* Progress Bar for Download All */}
          {isDownloading && downloadProgress > 0 && (
            <div style={{ width: '100%', marginBottom: 8 }}>
              <div style={{ 
                background: '#2a2a2a', 
                borderRadius: 10, 
                height: 8, 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  background: sparkColors[500], 
                  height: '100%', 
                  width: `${(downloadProgress / iconSizes.length) * 100}%`,
                  transition: 'width 0.3s ease',
                  borderRadius: 10,
                }} />
              </div>
              <div style={{ color: '#888', fontSize: 11, marginTop: 4, textAlign: 'center' }}>
                Downloading {downloadProgress} of {iconSizes.length}
              </div>
            </div>
          )}

          <button 
            style={{ ...styles.downloadBtn, background: sparkColors[500] }} 
            onMouseEnter={(e) => e.target.style.background = sparkColors[600]}
            onMouseLeave={(e) => e.target.style.background = sparkColors[500]}
            onClick={downloadLogo}
            disabled={isDownloading}
          >
            {isDownloading && downloadProgress === 0 ? '⏳ Generating...' : `⬇️ Download ${currentSize}×${currentSize} PNG`}
          </button>

          <button 
            style={{ 
              ...styles.downloadBtn, 
              background: '#2a2a2a',
              border: `2px solid ${sparkColors[500]}`,
              marginTop: 8,
            }} 
            onMouseEnter={(e) => e.target.style.background = '#3a3a3a'}
            onMouseLeave={(e) => e.target.style.background = '#2a2a2a'}
            onClick={downloadAllSizes}
            disabled={isDownloading}
          >
            {isDownloading && downloadProgress > 0 
              ? `⏳ Downloading ${downloadProgress}/${iconSizes.length}` 
              : '📦 Download All Sizes (8 files)'}
          </button>
          
          <div style={{ color: '#666', fontSize: 11, marginTop: 8, textAlign: 'center' }}>
            ⚡ Rendered at 4x for ultra-sharp quality (recommended for logos)
          </div>
        </div>

        {/* CONTROLS */}
        <div style={styles.controls}>
          {/* Brand Name */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>🏷️ Brand Name</label>
            <input
              type="text"
              style={styles.input}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="TheSpark"
            />
          </div>

          {/* Tagline */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>📝 Tagline</label>
            <input
              type="text"
              style={styles.input}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One spark. One fire. One wealthy Nigeria."
            />
          </div>

          {/* Icon Source */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>🔥 Icon Source</label>
            <div style={styles.iconToggle}>
              <button
                style={{
                  ...styles.toggleBtn,
                  ...(iconMode === 'emoji' ? { ...styles.toggleActive, borderColor: sparkColors[500] } : {}),
                }}
                onClick={switchToEmoji}
              >
                🔥 Emoji
              </button>
              <button
                style={{
                  ...styles.toggleBtn,
                  ...(iconMode === 'upload' ? { ...styles.toggleActive, borderColor: sparkColors[500] } : {}),
                }}
                onClick={switchToUpload}
              >
                🖼️ Upload
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={styles.fileInput}
              onChange={handleImageUpload}
            />
            <div style={styles.hint}>
              {iconMode === 'emoji'
                ? '🔥 Using spark orange flame'
                : uploadedImage
                ? '✅ Image uploaded'
                : 'Click Upload to add your own icon'}
            </div>
          </div>

          {/* Colors */}
          <div style={styles.row}>
            <div style={styles.controlGroup}>
              <label style={styles.label}>🎨 Background</label>
              <input
                type="color"
                style={styles.colorInput}
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
            <div style={styles.controlGroup}>
              <label style={styles.label}>✏️ Text Color</label>
              <input
                type="color"
                style={styles.colorInput}
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
          </div>

          {/* Shape */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>📐 Shape</label>
            <select
              style={styles.select}
              value={shape}
              onChange={(e) => setShape(e.target.value)}
            >
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>

          {/* Preset Color Schemes */}
          <div style={styles.controlGroup}>
            <label style={styles.label}>🎯 Spark Color Presets</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  style={{
                    padding: '6px 4px',
                    background: preset.bg,
                    color: preset.text,
                    border: `2px solid ${preset.bg === bgColor ? sparkColors[500] : '#3a3a3a'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 10,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                  onClick={() => {
                    setBgColor(preset.bg);
                    setTextColor(preset.text);
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            style={{
              ...styles.downloadBtn,
              background: '#2a2a2a',
              border: `2px solid ${sparkColors[500]}`,
              marginTop: 10,
            }}
            onMouseEnter={(e) => e.target.style.background = '#3a3a3a'}
            onMouseLeave={(e) => e.target.style.background = '#2a2a2a'}
            onClick={() => {
              setBgColor(sparkColors[50]);
              setTextColor(sparkColors[900]);
              setBrand('TheSpark');
              setTagline('One spark. One fire. One wealthy Nigeria.');
              setShape('circle');
              setDownloadSize('256');
              setPreviewWidth(256);
              setPreviewHeight(256);
              setShowText(true);
            }}
          >
            🔄 Reset to TheSpark Brand
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== STYLES ==========
const styles = {
  container: {
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    background: '#1a1a1a',
    borderRadius: 40,
    padding: 40,
    boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
    border: '1px solid #333',
    boxSizing: 'border-box',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 30,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  titleIcon: {
    padding: '4px 14px',
    borderRadius: 40,
    fontSize: 22,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 40,
  },
  previewArea: {
    background: '#111',
    borderRadius: 28,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #2a2a2a',
  },
  previewLabel: {
    color: '#888',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },
  previewBox: {
    aspectRatio: '1/1',
    transition: 'all 0.3s ease',
    marginBottom: 20,
  },
  downloadBtn: {
    color: '#fff',
    border: 'none',
    padding: '14px 30px',
    borderRadius: 60,
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 14,
    padding: '12px 16px',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    transition: '0.2s',
    width: '100%',
  },
  colorInput: {
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 14,
    padding: 6,
    height: 50,
    cursor: 'pointer',
    width: '100%',
  },
  range: {
    width: '100%',
    cursor: 'pointer',
  },
  select: {
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 14,
    padding: '12px 16px',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    width: '100%',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  iconToggle: {
    display: 'flex',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    background: '#2a2a2a',
    border: '2px solid #3a3a3a',
    borderRadius: 14,
    padding: '8px 18px',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    transition: '0.2s',
  },
  toggleActive: {
    background: '#2a1a10',
    boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)',
  },
  fileInput: {
    background: '#1f1f1f',
    border: '1px solid #3a3a3a',
    borderRadius: 14,
    padding: 10,
    color: '#aaa',
    width: '100%',
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
};

export default LogoDesigner;