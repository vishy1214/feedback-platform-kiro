import React from "react";
import { TagCloud } from "react-tagcloud";

export default function WordCloud({ themes }) {
  // Transform themes data into tag cloud format
  const data = themes.map(theme => ({
    value: theme.theme,
    count: theme.count
  }));

  // Custom renderer for tags
  const customRenderer = (tag, size, color) => (
    <span
      key={tag.value}
      style={{
        fontSize: `${size}px`,
        color: color,
        margin: '8px',
        padding: '4px 8px',
        display: 'inline-block',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontWeight: '500'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      {tag.value}
    </span>
  );

  // Color options for the word cloud
  const colorOptions = {
    luminosity: 'dark',
    hue: 'blue'
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {data.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#666',
          padding: '40px 20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>☁️</div>
          <div style={{ fontSize: '14px' }}>No themes to visualize yet</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Word cloud will appear as themes are identified
          </div>
        </div>
      ) : (
        <TagCloud
          minSize={16}
          maxSize={48}
          tags={data}
          colorOptions={colorOptions}
          renderer={customRenderer}
          onClick={(tag) => console.log('Tag clicked:', tag.value)}
        />
      )}
    </div>
  );
}
