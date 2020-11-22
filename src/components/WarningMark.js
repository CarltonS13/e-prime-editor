import { Mark } from 'tiptap'
import { toggleMark } from 'tiptap-commands'


export default class WarningMark extends Mark {
 get name() {
   return "warn";
 }

 get schema() {
   return {
     attrs: {
       color: {
         default: "none"
       }
     },
     parseDOM: [
       {
         tag: "warn"
       }
     ],
     toDOM: mark => [
       "span",
       {
         class: 'warning',
         style: `background:${mark.attrs.color}`
       },
       0
     ]
   };
 }

 commands({ type }) {
   return attrs => toggleMark(type, attrs);

 }

}
