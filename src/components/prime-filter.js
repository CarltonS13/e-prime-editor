var ePrimeBanned = [" be ", " is ", " am ", " was ", " are ", " were ",
" been ", " being ", " isn't ", " aren't ", " wasn't ", " weren't ",
" aint ", " ain't ", "I'm ", " it's ", "It's ", " he's ", "He's ",
 " she's ", "She's ", " they're ", "They're ", " we're ", "We're ",
  "You're ", " you're ", " there's ", "There's ", "Here's ", " here's ",
   "Where's ", " where's ", "How's ", " how's ", "What's ", " what's ",
   "Who's ", " who's ", "That's ", " that's "," be.", " is.", " am.", " was.", " are.", " were.",
   " been.", " being.", " isn't.", " aren't.", " wasn't.", " weren't.",
   " aint.", " ain't.", "I'm.", " it's.", "It's.", " he's.", "He's.",
    " she's.", "She's.", " they're.", "They're.", " we're.", "We're.",
     "You're.", " you're.", " there's.", "There's.", "Here's.", " here's.",
      "Where's.", " where's.", "How's.", " how's.", "What's.", " what's.",
      "Who's.", " who's.", "That's.", " that's."];


export function filterBanned(content) {
  console.log("ord: ", content)
  var word;
  for (word of ePrimeBanned) {
    content = content.replace(word, "<warn>" + word + " </warn>")
  }
  console.log("new: ", content)
  return content
}
