import NSpell from "nspell";
import dictionary from "dictionary-en";
import { promisify } from "util";


let spell;

const loadDictionary = promisify(dictionary);

export async function loadSpellChecker(){
    if(!spell){
        const dict = await loadDictionary();
        spell = NSpell(dict);
    }
    return spell;
}

export async function correctText(text){
    const sp = await loadSpellChecker();
    return text.split(/\b/).map(word=>{
        if(!sp.correct(word)){
            const suggestions = sp.suggest(word);
            return suggestions.length ? suggestions[0] : word;
        }
        return word;
    }).join("");
}