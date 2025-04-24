import React from 'react'
import CampaignPage from './CampaignPage' // O el componente que quieres mostrar

export default function WidgetEmbed() {
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <CampaignPage /> {/* O el componente que represente el widget */}
    </div>
  )
}
