comps.conversation = x => [
  m('h3', {
    oncreate: x =>
      io('/ollama').emit('list', ({models}) =>
        localStorage.setItem(
          'model_list', JSON.stringify(models)
        )
      )
  }, "Let's chat.."),

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
      model: {
        type: String, autoform: {
          type: 'select', options: x =>
          JSON.parse(localStorage.model_list).map(
            i => ({value: i.name, label: i.name})
          )
        }
      },
      message: {
        label: 'Message',
        type: String, autoform: {
          type: 'textarea',
          placeholder: 'start asking anything'
        }
      }
    },
    submit: {value: 'Send'},
    doc: ifit(
      localStorage.threads,
      threads => _.pick(_.last(
        JSON.parse(threads)
      ), 'model')
    ),
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
        {model: doc.model, messages: [
          ...withAs(
            JSON.parse(localStorage.threads || '[]'),
            thread => thread.slice(0, thread.length-1)
          ).map(i => _.assign(i, {content: i.message})),
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
              role: 'assistant', requestTime: _.now(),
              model: doc.model
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
