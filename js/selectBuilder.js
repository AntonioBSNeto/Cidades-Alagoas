import { node } from './consts.js'

node.forEach((cidade) => {
    addOption(cidade, "src")
    addOption(cidade, "dst")
})

function addOption(valor, id) {
    var select = document.getElementById(id);
    var option = new Option(valor.title, valor.id);
    select.add(option)
}