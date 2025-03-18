import React, { useState, useEffect } from "react"

const ThreeVisibleCards = () => {
  // Just 3 cards
  const cards = [
    {
      id: 1,
      title: "Card One",
      content: "Content for card one",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Card Two",
      content: "Content for card two",
      color: "bg-purple-500"
    },
    {
      id: 3,
      title: "Card Three",
      content: "Content for card three",
      color: "bg-pink-500"
    }
  ]

  // State for storing card positions
  const [cardPositions, setCardPositions] = useState<
    {
      id: number
      translateX: number
      translateY: number
      rotation: number
      zIndex: number
    }[]
  >([])

  // Generate positions that ensure visibility
  useEffect(() => {
    // Predetermined positions to ensure all cards are visible
    const positions = [
      {
        id: 1,
        translateX: 50,
        translateY: 50,
        rotation: -15,
        zIndex: 10
      },
      {
        id: 2,
        translateX: 200,
        translateY: 80,
        rotation: 5,
        zIndex: 11
      },
      {
        id: 3,
        translateX: 350,
        translateY: 30,
        rotation: 12,
        zIndex: 12
      }
    ]

    setCardPositions(positions)
  }, [])

  // State to track which card is being hovered
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="relative h-80 w-full max-w-3xl">
        {/* Table surface */}
        <div className="absolute inset-0 rounded-xl bg-green-800 shadow-lg"></div>

        {/* Positioned cards */}
        <div className="absolute inset-0">
          {cards.map(card => {
            const position = cardPositions.find(pos => pos.id === card.id)

            // Only proceed if we have position data
            if (!position) return null

            const isHovered = hoveredId === card.id

            return (
              <div
                key={card.id}
                className={`absolute ${card.color} h-40 w-64 cursor-pointer rounded-lg p-6 text-white shadow-xl transition-all duration-300 ease-out`}
                style={{
                  transform: `translateX(${position.translateX}px) translateY(${position.translateY}px) rotate(${position.rotation}deg) ${isHovered ? "scale(1.1) translateY(-20px)" : ""}`,
                  zIndex: isHovered ? 50 : position.zIndex
                }}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <h2 className="mb-2 text-xl font-bold">{card.title}</h2>
                <p>{card.content}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ThreeVisibleCards
