<template>
<div class="editor">
  <editor-menu-bar v-slot="{ commands, isActive }" :editor="editor">
    <div class="menubar">
      <span v-for="actionName in activeButtons" :key="actionName">
        <button v-if="actionName === 'bold'" class="menubar__button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          <icon name="bold" />
        </button>
        <button v-if="actionName === 'italic'" class="menubar__button" :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
          <icon name="italic" />
        </button>
        <button v-if="actionName === 'strike'" class="menubar__button" :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
          <icon name="strike" />
        </button>

        <button v-if="actionName === 'underline'" class="menubar__button" :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
          <icon name="underline" />
        </button>

        <button v-if="actionName === 'code'" class="menubar__button" :class="{ 'is-active': isActive.code() }" @click="commands.code">
          <icon name="code" />
        </button>

        <button v-if="actionName === 'paragraph'" class="menubar__button" :class="{ 'is-active': isActive.paragraph() }" @click="commands.paragraph">
          <icon name="paragraph" />
        </button>

        <button v-if="actionName === 'h1'" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
          H1
        </button>

        <button v-if="actionName === 'h2'" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
          H2
        </button>

        <button v-if="actionName === 'h3'" class="menubar__button" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
          H3
        </button>

        <button v-if="actionName === 'bullet_list'" class="menubar__button" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
          <icon name="ul" />
        </button>

        <button v-if="actionName === 'ordered_list'" class="menubar__button" :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
          <icon name="ol" />
        </button>

        <button v-if="actionName === 'blockquote'" class="menubar__button" :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
          <icon name="quote" />
        </button>

        <button v-if="actionName === 'code_block'" class="menubar__button" :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
          <icon name="code" />
        </button>

        <button v-if="actionName === 'horizontal_rule'" class="menubar__button" @click="commands.horizontal_rule">
          <icon name="hr" />
        </button>

        <button v-if="actionName === 'undo'" class="menubar__button" @click="commands.undo">
          <icon name="undo" />
        </button>

        <button v-if="actionName === 'redo'" class="menubar__button" @click="commands.redo">
          <icon name="redo" />
        </button>
      </span>
    </div>
  </editor-menu-bar>

  <editor-content class="editor__content" :editor="editor" />
</div>
</template>

<script>
import Icon from './Icon'
import WarningMark from './WarningMark'
import {
  filterBanned
} from './prime-filter'
import {
  Editor,
  EditorContent,
  EditorMenuBar
} from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
  },
  props: {
    initialContent: {
      type: String,
      required: false,
      default: 'Write something amazing!',
    },
    activeButtons: {
      type: Array,
      validator: function(list) {
        for (let el of list) {
          // The value must match one of these strings
          if (
            [
              'bold',
              'italic',
              'strike',
              'underline',
              'code',
              'paragraph',
              'h1',
              'h2',
              'h3',
              'bullet_list',
              'ordered_list',
              'blockquote',
              'code_block',
              'horizontal_rule',
              'undo',
              'redo',
            ].indexOf(el) === -1
          ) {
            return -1
          }
        }
        return 1
      },
      default: () => [
        'bold',
        'italic',
        'strike',
        'underline',
        'paragraph',
        'h1',
        'h2',
        'h3',
        'bullet_list',
        'ordered_list',
        'blockquote',
        'horizontal_rule',
        'undo',
        'redo',
      ],
    },
  },
  data() {
    return {
      html: '',
      json: '',
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({
            levels: [1, 2, 3, 4, 5]
          }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new WarningMark(),
        ],
        content: this.initialContent,
        // parseOptions: {preserveWhitespace:'full'},
      }),
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  created() {
    // this.html = this.editor.getHTML()
    // this.json = this.editor.getJSON()

    this.editor.on('update', (update_object) => {
      const warn = "<span class=\"warning\" style=\"background:none\">"
      this.html = update_object.getHTML()
      const cursor = this.editor.state.selection.anchor
      const editor_len = this.editor.state.doc.textContent.length
      console.log(cursor)
      console.log(editor_len)
      console.log(this.editor.state.doc.textContent.charAt(editor_len - 1))
      if (cursor > editor_len && this.editor.state.doc.textContent.charAt(editor_len - 1) != " ") {
        var new_content = String(this.html).replace(warn, "").replace("</warn>", "")
        new_content = filterBanned(new_content)
        this.editor.setContent(new_content)
        this.editor.setSelection(cursor, cursor)
      }

    })
  },
}
</script>

<style lang="css" scoped></style>
