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
        {model: 'gemma3:270m', messages: [
          ...withAs(
            JSON.parse(localStorage.threads || '[]'),
            thread => thread.slice(0, thread.length-1)
          ),
          {role: 'user', content: doc.message}
        ]},
        response => [
          localStorage.setItem('threads', JSON.stringify([
            ...withAs(
              JSON.parse(localStorage.threads || '[]'),
              thread => thread.slice(0, thread.length-1)
            ),
            { // add response to the thread
              message: response.message.content,
              role: 'assistant', requestTime: _.now()
            }
          ])),
          m.redraw()
        ]
      )
    ],
    buttons: localStorage.threads && [
      {label: 'Reset', opt: {
        class: 'is-warning',
        onclick: e => confirm('Are you sure?') && [
          e.preventDefault(),
          localStorage.removeItem('threads'),
          m.redraw(), scroll(0, 0)
        ]
      }},
      {label: 'Simpan', opt: {
        class: 'is-success',
      }},
    ]
  }))
]
