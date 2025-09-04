m.mount(document.body, mitGen({
  theme: 'slate',
  brand: {name: 'home', full: 'Ollama'},
  start: {
    chat: {
      full: 'Conversation', icon: 'comment',
      comp: comps.conversation
    }
  },
  end: userMenu
}))
