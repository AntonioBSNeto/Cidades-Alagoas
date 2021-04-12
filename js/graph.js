import { Network } from '../node_modules/vis-network/standalone/esm/vis-network.js'
import { node, edges, options } from './consts.js'

const container = document.getElementById("mynetwork");

const data = {
  nodes: node,
  edges: edges
}

const network = new Network(container, data, options);

//Variaveis de controle para a desmarcacao de pontos já marcados
let pI = false;
let nI = -1;

function destaqueInicio() {

  if(pI == true){
    pI=false
    var node = network.body.nodes[nI]
    node.setOptions({
      color: {
        border: '#000000',
        background: '#ffffff'
      }
    })
    destaqueInicio()
    return
  }

  var select = document.getElementById("src");
  var no = select.options[select.selectedIndex].value;
  var node = network.body.nodes[no];
  pI = !pI
  nI = no
  node.setOptions({
    color: {
      border: '#000000',
      background: '#198754'
    }
  });
  network.redraw()

}

//Variaveis de controle para a desmarcacao de pontos já marcados
let pF = false;
let nF = -1;

function destaqueFim() {

  if(pF == true){
    pF=false
    var node = network.body.nodes[nF]
    node.setOptions({
      color: {
        border: '#000000',
        background: '#ffffff'
      }
    })
    destaqueFim()
    return
  }

  var select = document.getElementById("dst");
  var no = select.options[select.selectedIndex].value;
  var node = network.body.nodes[no];
  pF = !pF
  nF = no
  node.setOptions({
    color: {
      border: '#000000',
      background: '#dc3545'
    }
  });
  network.redraw()

}


var $ = document.querySelector.bind(document);

$('#src').addEventListener('change', destaqueInicio);
$('#dst').addEventListener('change', destaqueFim);