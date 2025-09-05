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
      'message': {
        label: 'Message',
        type: String, autoform: {
          type: 'textarea',
          placeholder: 'start asking anything'
        }
      }
    },
    submit: {value: 'Send'},
    action: doc => [
      // add prompt to thread
      localStorage.setItem('threads', JSON.stringify([
        ...JSON.parse(localStorage.threads || '[]'),
        {...doc, role: 'user', requestTime: _.now()},
        // say that it's thinking
        {message: "Let me think...", role: 'assistant'}
      ])),
      // call an ollama model
      io('/ollama').emit('ask',
        {model: 'gemma3:270m', messages: [{
          role: 'user', content: doc.message
        }]},
        response => [
          localStorage.setItem('threads', JSON.stringify([
            ...withAs( // omit the early response
              JSON.parse(localStorage.threads || '[]'),
              threads => threads.slice(0, threads.length-1)
            ),
            { // add response to the thread
              message: response.message.content,
              role: 'assistant', requestTime: _.now()
            }
          ])),
          m.redraw()
        ]
      )
    ]
  }))
]
