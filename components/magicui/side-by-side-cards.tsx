"use client"

/*
<ai_context>
A component that displays three side-by-side cards that bobble when hovered, each with an icon and caption.
</ai_context>
<recent_changes>
Created a new component for side-by-side cards with bobble animation on hover.
</recent_changes>
*/

import React, { useState } from "react"
import { LightbulbIcon, BookOpenIcon, CodeIcon } from "lucide-react"

interface CardData {
  id: number
  title: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  shadowColor: string
}

const SideBySideCards = () => {
  // Define the cards with their respective icons and colors
  const cards: CardData[] = [
    {
      id: 1,
      title: "Idea",
      icon: <LightbulbIcon className="mb-4 size-12" />,
      color: "bg-amber-100",
      hoverColor: "bg-amber-200",
      shadowColor: "shadow-amber-300/50"
    },
    {
      id: 2,
      title: "Conventions",
      icon: <BookOpenIcon className="mb-4 size-12" />,
      color: "bg-blue-100",
      hoverColor: "bg-blue-200",
      shadowColor: "shadow-blue-300/50"
    },
    {
      id: 3,
      title: "Starter Code",
      icon: <CodeIcon className="mb-4 size-12" />,
      color: "bg-emerald-100",
      hoverColor: "bg-emerald-200",
      shadowColor: "shadow-emerald-300/50"
    }
  ]

  // State to track which card is being hovered
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="flex w-full items-center justify-center py-12">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        {cards.map(card => {
          const isHovered = hoveredId === card.id

          return (
            <div
              key={card.id}
              className={`
                relative rounded-xl p-6 
                ${isHovered ? card.hoverColor : card.color} 
                ${card.shadowColor}
                flex h-64 cursor-pointer flex-col
                items-center justify-center text-center shadow-lg transition-all
                duration-300 ease-out
              `}
              style={{
                transform: isHovered
                  ? "translateY(-12px) scale(1.03)"
                  : "translateY(0) scale(1)",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
              }}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Bobble animation container */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  animation: isHovered
                    ? "bobble 1s ease-in-out infinite alternate"
                    : "none"
                }}
              >
                {/* Icon */}
                <div className="text-gray-800">{card.icon}</div>

                {/* Title */}
                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  {card.title}
                </h3>

                {/* Caption */}
                <p className="text-sm text-gray-600">
                  {card.id === 1 && "Transform your concepts into reality"}
                  {card.id === 2 && "Follow best practices and patterns"}
                  {card.id === 3 && "Begin with solid foundations"}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* CSS for the bobble animation */}
      <style jsx global>{`
        @keyframes bobble {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  )
}

export default SideBySideCards
