import { getHomeCopy } from '../lib/uiCopy'

export default function HomePage() {
  const { title, placeholder, quickPrompts } = getHomeCopy()

  return (
    <main>
      <h1>{title}</h1>
      <div>
        <input type="text" placeholder={placeholder} />
      </div>
      <ul>
        {quickPrompts.map((prompt) => (
          <li key={prompt.id}>{prompt.text}</li>
        ))}
      </ul>
    </main>
  )
}
