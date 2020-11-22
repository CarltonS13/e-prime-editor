import {
  Extension,
  Plugin
} from 'tiptap'

import {
  DecorationSet,
  Decoration
} from 'prosemirror-view'

const ePrimeBanned = ["be","is","am","was","are","were",
"been","being","isn't","aren't","wasn't","weren't",
"aint","ain't","I'm","it's","It's","he's","He's",
"she's","She's","they're","They're","we're","We're",
"You're","you're","there's","There's","Here's","here's",
"Where's","where's","How's","how's","What's","what's",
"Who's","who's","That's","that's"];

// Words you probably shouldn't use
const badWords = new RegExp("\\b(" + ePrimeBanned.join("|") + ")\\b", 'ig');
function lint(doc) {
  let result = [],
    lastHeadLevel = null

  function record(msg, from, to, fix) {
    result.push({
      msg,
      from,
      to,
      fix
    })
  }

  // For each node in the document
  doc.descendants((node, pos) => {
    if (node.isText) {
      // Scan text nodes for suspicious patterns
      let m
      while ((m = badWords.exec(node.text))){
        record(`Try not to say '${m[0]}'`,
          pos + m.index, pos + m.index + m[0].length)
        }
    } else if (node.type.name == "heading") {
      // Check whether heading levels fit under the current level
      let level = node.attrs.level
      if (lastHeadLevel != null && level > lastHeadLevel + 1)
        record(`Heading too small (${level} under ${lastHeadLevel})`,
          pos + 1, pos + 1 + node.content.size,
          fixHeader(lastHeadLevel + 1))
      lastHeadLevel = level
    } else if (node.type.name == "image" && !node.attrs.alt) {
      // Ensure images have alt text
      record("Image without alt text", pos, pos + 1, addAlt)
    }
  })

  return result
}


function fixHeader(level) {
  return function({
    state,
    dispatch
  }) {
    dispatch(state.tr.setNodeMarkup(this.from - 1, null, {
      level
    }))
  }
}

function addAlt({
  state,
  dispatch
}) {
  let alt = prompt("Alt text", "")
  if (alt) {
    let attrs = Object.assign({}, state.doc.nodeAt(this.from).attrs, {
      alt
    })
    dispatch(state.tr.setNodeMarkup(this.from, null, attrs))
  }
}


export default class WarningDecoration extends Extension {

  get name() {
    return 'badWords'
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          decorations({
            doc
          }) {
            let decos = []
            lint(doc).forEach(prob => {
              decos.push(Decoration.inline(prob.from, prob.to, {
                  class: "warning"
                }))
            })
            return DecorationSet.create(doc, decos)
          },
        },
      }),
    ]
  }

}
