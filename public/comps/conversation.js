comps.conversation = x => [
  m('h3', "Let's chat.."),

  // Threads of interactions
  JSON.parse(localStorage.threads || '[]')
  .map(thread => m(
    'article.message',
    {class: [
      localStorage.fontSize,
      thread.role === 'user' && 'is-primary'
    ].join(' ')},
    m('.message-body', m('p', m.trust(
      marked.parse(thread.message)
    )))
  )),

  m(autoForm({
    id: 'conversation',
    schema: {
      'prompt': {
        type: String, autoform: {
          type: 'textarea',
          placeholder: 'start asking anything'
        }
      }
    },
    submit: {value: 'Send'},
    action: doc => io('/ollama').emit(
      'ask', {
        model: 'gemma3:270m',
        messages: [{
          role: 'user',
          content: doc.prompt
        }]
      }, console.log
    )
  }))
]
