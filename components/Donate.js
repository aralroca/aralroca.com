"use client";

export default function DonateButton({ children }) {
  function donate() {
    const donateEl = document.querySelector('#donate')
    donateEl.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div onClick={donate} role="button" className="donate-btn">
      {children}
    </div>
  )
}