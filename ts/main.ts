//Classe Principal que fara toda a lógica da aplicação
class Main {
    grafo: Grafo = new Grafo(numVertices);

    constructor() {

        for (let i = 0; i < numArestas; i++) {
            let src: number = edges[i].origem;
            let dst: number = edges[i].destino;
            let peso: number = edges[i].peso;

            this.grafo.addAresta(src, dst, peso);
        }
        let btn = document.getElementById("calcula") as HTMLElement;
        btn.addEventListener("click", (e: Event) => this.menorCaminho());

    }

    //Função que exibe na tela o menor caminho 
    menorCaminho() {

        let origem = (<HTMLSelectElement>document.getElementById("src")).value;
        let destino = (<HTMLSelectElement>document.getElementById("dst")).value;

        if(origem === "" || destino === ""){
            window.alert("Preencha todos os campos"); 
            return
        }else if( origem == destino){
            window.alert("Os campos não podem ser iguais"); 
            return
        }

        let src: number = Number(origem);
        let dst: number = Number(destino);

        this.grafo.dijkastra(src, dst)

        let antecessores: number[] = this.grafo.antecessores;
        let menorDistancia: number = this.grafo.dist[dst];

        let pMenorDistancia = (<HTMLSelectElement>document.getElementById("menorDistancia"))
        let pCaminho = (<HTMLSelectElement>document.getElementById("caminho"))

        if(menorDistancia == 100000){
            pMenorDistancia = (<HTMLSelectElement>document.getElementById("menorDistancia"))
            pMenorDistancia.textContent = "Desculpa, ainda não conhecemos nenhuma estrada que conecta essas duas cidades"
            pCaminho.textContent = "";
            return
        }

        let index = 0;

        let path: number[] = [];
        path[index] = dst;

        while(dst != src){
           index++;
           let pos: number = antecessores[dst];
           path[index] = pos;
           dst = pos
        }




        let cidadeComeco = nodes[path[index]]
        let cidadeFim = nodes[path[0]]

        pMenorDistancia.textContent = "Menor distância entre "+cidadeComeco+ " e "+ cidadeFim+ " é: "+ menorDistancia + " KM"

        let caminho = "";

        for (let i = index; i > 0; i--) {
            caminho += nodes[path[i]] + " -> "
        }
        caminho += nodes[path[0]]
        pCaminho.textContent =  "Trajeto: "+ caminho


    }

}

//Função que inicializa o grafo
function start(){
    new Main()
}

//Classe do grafo que constroi o grafo e suas aplicações
class Grafo {

    vertices: number;
    adj: Array<ListaLigada>;
    dist: number[];
    antecessores: number[];

    constructor(vertices: number) {
        this.vertices = vertices;
        this.adj = new Array(vertices);
        this.dist = new Array(vertices);
        this.antecessores = [];

        for (let i = 0; i < vertices; i++) {
            this.adj[i] = new ListaLigada();
        }

    }

    public addAresta(src: number, dst: number, peso: number) {
        let aux: No = new No(dst, peso);
        this.adj[src].add(aux);
        aux = new No(src, peso);
        this.adj[dst].add(aux);

    }

    public dijkastra(src: number, dest: number) {
        let v: number = this.vertices;
        let minHeap: MinHeap = new MinHeap(v);

        for (let i = 0; i < v; i++) {
            this.dist[i] = 100000;
            this.antecessores[i] = -1;
            minHeap.heap[i] = minHeap.novoHeapNode(i, this.dist[i]);

            minHeap.pos[i] = i;
        }

        minHeap.pos[src] = src;
        this.dist[src] = 0;
        minHeap.decreaseKey(src, this.dist[src]);

        minHeap.size = v;

        while (minHeap.size != 0) {
            let aux: No = minHeap.remove();

            let u: number = aux.dst;
            let tmp: NoDuplo = this.adj[u].primeiro;
            for (let i = 0; i < this.adj[u].numNos; i++) {
                let vrt: number = tmp.valor.dst;

                if (minHeap.isInMinHeap(vrt) &&
                    this.dist[u] != 100000 &&
                    tmp.valor.peso + this.dist[u] < this.dist[vrt]) {

                    this.dist[vrt] = tmp.valor.peso + this.dist[u];
                    this.antecessores[vrt] = u;
                    minHeap.decreaseKey(vrt, this.dist[vrt]);
                }

                tmp = tmp.proximo;
            }
            if (dest == u)
                break;
        }


    }

}


//Classe que cria um heap de minimo e é ulilizado na implementaccao do algoritmo de Dijkstra
class MinHeap {

    heap: No[];
    pos: number[];
    size: number;

    constructor(size: number) {
        this.size = 0;
        this.heap = new Array(size);
        this.pos = new Array(size);
    }

    public novoHeapNode(vertice: number, peso: number) {
        return new No(vertice, peso);
    }

    private left(i: number) {
        return (i * 2)+1;
    }

    private right(i: number) {
        return (i * 2) +2;
    }

    public remove() {
        if (this.size == 0) {
            return {} as No;
        }

        let removido: No = this.heap[0];

        let ultimo: No = this.heap[this.size -1];
        this.heap[0] = ultimo;

        this.pos[ultimo.dst] = 0;
        this.pos[removido.dst] = this.size -1;

        this.size--;
        this.minHeapify(0);

        return removido;
    }

    private minHeapify(i: number) {
        let l: number = this.left(i);
        let r: number = this.right(i);
        let menor: number;

        if (l < this.size && this.heap[l].peso < this.heap[i].peso) {
            menor = l;
        } else {
            menor = i;
        }
        

        if (r < this.size && this.heap[r].peso < this.heap[menor].peso) {
            menor = r;
        }

        if (menor != i) {
            this.pos[this.heap[menor].dst] = i;
            this.pos[this.heap[i].dst] = menor;

            this.swap(i, menor);

            this.minHeapify(menor);

        }

    }

    private swap(x: number, y: number) {
        let tmp: No;
        tmp = this.heap[x];
        this.heap[x] = this.heap[y];
        this.heap[y] = tmp;
    }

    public decreaseKey(vertice: number, peso: number) {
        let i: number = this.pos[vertice];
        this.heap[i].peso = peso;
        

        while (i > 0 && this.heap[i].peso < this.heap[~~((i-1) / 2)].peso) {
            this.pos[this.heap[i].dst] = ~~((i-1) / 2);
            this.pos[this.heap[~~((i-1) / 2)].dst] = i;
            this.swap(i, ~~((i-1) / 2));

            i = ~~((i-1) / 2);
        }

    }

    public isInMinHeap(v: number) {
        return (this.pos[v] < this.size);
    }

}

//Classe que forma a lista de adjacendica que forma o grafo
class No {
    dst: number;
    peso: number;

    constructor(dst: number, peso: number) {
        this.dst = dst;
        this.peso = peso;
    }

}


//Classe auxiliar para construcao da lista ligada
class NoDuplo {

    valor: No;
    proximo: NoDuplo;
    anterior: NoDuplo;

    constructor(valor: No) {
        this.valor = valor;
        this.proximo = {} as NoDuplo;
        this.anterior = {} as NoDuplo;
    }

}

//Classe que controi a lista ligada
class ListaLigada {
    primeiro: NoDuplo;
    ultimo: NoDuplo;
    numNos: number;

    constructor() {
        this.primeiro = new NoDuplo(new No(-1,-1));
        this.ultimo = new NoDuplo(new No(-1,-1));
        this.numNos = 0;
    }

    public add(valor: No) {
        this.numNos++;
        let novoNo: NoDuplo = new NoDuplo(valor);
        novoNo.anterior = this.ultimo;
        
        if (this.primeiro.valor.dst == -1) {
            this.primeiro = novoNo;
        }
        if (this.ultimo.valor.dst != -1) {
            this.ultimo.proximo = novoNo;
        }
        this.ultimo = novoNo;

    }

}



// Todas as constantes utilizadas no programa
const numVertices: number = 102;

const numArestas: number = 116;

const nodes = [
    "Água Branca",
    "Anadia",
    "Arapiraca",
    "Atalaia",
    "Barra de Santo Antônio",
    "Barra de São Miguel",
    "Batalha",
    "Belém",
    "Belo Monte",
    "Boca da Mata",
    "Branquinha",
    "Cacimbinhas",
    "Cajueiro",
    "Campestre",
    "Campo Alegre",
    "Campo Grande",
    "Canapi",
    "Capela",
    "Carneiros",
    "Chã Preta",
    "Coité do Noia",
    "Colônia Leopoldina",
    "Coqueiro Seco",
    "Coruripe",
    "Craíbas",
    "Delmiro Gouveia",
    "Dois Riachos",
    "Estrela de Alagoas",
    "Feira Grande",
    "Feliz Deserto",
    "Flexeiras",
    "Girau do Ponciano",
    "Ibateguara",
    "Igaci",
    "Igreja Nova",
    "Inhapi",
    "Jacaré dos Homens",
    "Jacuípe",
    "Japaratinga",
    "Jaramataia",
    "Jequiá da Praia",
    "Joaquim Gomes",
    "Jundiá",
    "Junqueiro",
    "Lagoa da Canoa",
    "Limoeiro de Anadia",
    "Maceió",
    "Major Izidoro",
    "Mar Vermelho",
    "Maragogi",
    "Maravilha",
    "Marechal Deodoro",
    "Maribondo",
    "Mata Grande",
    "Matriz de Camaragibe",
    "Messias",
    "Minador do Negrão",
    "Monteirópolis",
    "Murici",
    "Novo Lino",
    "Olho d'Água das Flores",
    "Olho d'Água do Casado",
    "Olho d'Água Grande",
    "Olivença",
    "Ouro Branco",
    "Palestina",
    "Palmeira dos Índios",
    "Pão de Açúcar",
    "Pariconha",
    "Paripueira",
    "Passo de Camaragibe",
    "Paulo Jacinto",
    "Penedo",
    "Piaçabuçu",
    "Pilar",
    "Pindoba",
    "Piranhas",
    "Poço das Trincheiras",
    "Porto Calvo",
    "Porto de Pedras",
    "Porto Real do Colégio",
    "Quebrangulo",
    "Rio Largo",
    "Roteiro",
    "Santa Luzia do Norte",
    "Santana do Ipanema",
    "Santana do Mundaú",
    "São Brás",
    "São José da Laje",
    "São José da Tapera",
    "São Luís do Quitunde",
    "São Miguel dos Campos",
    "São Miguel dos Milagres",
    "São Sebastião",
    "Satuba",
    "Senador Rui Palmeira",
    "Tanque d'Arca",
    "Taquarana",
    "Teotônio Vilela",
    "Traipu",
    "União dos Palmares",
    "Viçosa"
]

const edges: any = [
    {
        origem: 0,
        destino: 68,
        peso: 12.7
    },
    {
        origem: 0,
        destino: 25,
        peso: 19
    },
    {
        origem: 0,
        destino: 61,
        peso: 40.6
    },
    {
        origem: 0,
        destino: 35,
        peso: 28.4
    },
    {
        origem: 0,
        destino: 53,
        peso: 33.1
    },
    {
        origem: 1,
        destino: 52,
        peso: 13.4
    },
    {
        origem: 1,
        destino: 9,
        peso: 14.3
    },
    {
        origem: 1,
        destino: 14,
        peso: 21.5
    },
    {
        origem: 2,
        destino: 45,
        peso: 19
    },
    {
        origem: 2,
        destino: 20,
        peso: 21.4
    },
    {
        origem: 2,
        destino: 33,
        peso: 28.2
    },
    {
        origem: 2,
        destino: 24,
        peso: 20.2
    },
    {
        origem: 2,
        destino: 44,
        peso: 12
    },
    {
        origem: 2,
        destino: 93,
        peso: 29.4
    },
    {
        origem: 3,
        destino: 17,
        peso: 16.7
    },
    {
        origem: 3,
        destino: 12,
        peso: 26.3
    },
    {
        origem: 3,
        destino: 75,
        peso: 40.1
    },
    {
        origem: 3,
        destino: 74,
        peso: 11.8
    },
    {
        origem: 3,
        destino: 52,
        peso: 41
    },
    {
        origem: 4,
        destino: 90,
        peso: 15.3
    },
    {
        origem: 4,
        destino: 69,
        peso: 9.9
    },
    {
        origem: 5,
        destino: 51,
        peso: 8
    },
    {
        origem: 5,
        destino: 91,
        peso: 29.6
    },
    {
        origem: 5,
        destino: 83,
        peso: 22.3
    },
    {
        origem: 6,
        destino: 39,
        peso: 15.9
    },
    {
        origem: 6,
        destino: 47,
        peso: 25.4
    },
    {
        origem: 6,
        destino: 36,
        peso: 10.5
    },
    {
        origem: 7,
        destino: 66,
        peso: 25
    },
    {
        origem: 7,
        destino: 96,
        peso: 14.9
    },
    {
        origem: 7,
        destino: 97,
        peso: 176
    },
    {
        origem: 9,
        destino: 74,
        peso: 40
    },
    {
        origem: 10,
        destino: 100,
        peso: 11.7
    },
    {
        origem: 10,
        destino: 58,
        peso: 13.5
    },
    {
        origem: 11,
        destino: 56,
        peso: 28.1
    },
    {
        origem: 11,
        destino: 26,
        peso: 11
    },
    {
        origem: 11,
        destino: 47,
        peso: 15.3
    },
    {
        origem: 11,
        destino: 27,
        peso: 26.2
    },
    {
        origem: 12,
        destino: 17,
        peso: 9.7
    },
    {
        origem: 12,
        destino: 101,
        peso: 16.6
    },
    {
        origem: 14,
        destino: 45,
        peso: 23.9
    },
    {
        origem: 14,
        destino: 91,
        peso: 32.7
    },
    {
        origem: 15,
        destino: 31,
        peso: 9.9
    },
    {
        origem: 16,
        destino: 64,
        peso: 33.3
    },
    {
        origem: 16,
        destino: 50,
        peso: 36.3
    },
    {
        origem: 16,
        destino: 35,
        peso: 44.2
    },
    {
        origem: 16,
        destino: 53,
        peso: 15.3
    },
    {
        origem: 19,
        destino: 101,
        peso: 18.9
    },
    {
        origem: 20,
        destino: 45,
        peso: 17.1
    },
    {
        origem: 21,
        destino: 32,
        peso: 30.1
    },
    {
        origem: 21,
        destino: 59,
        peso: 15.6
    },
    {
        origem: 23,
        destino: 98,
        peso: 40
    },
    {
        origem: 23,
        destino: 40,
        peso: 26.2
    },
    {
        origem: 23,
        destino: 29,
        peso: 29.1
    },
    {
        origem: 25,
        destino: 61,
        peso: 24.4
    },
    {
        origem: 26,
        destino: 85,
        peso: 19.2
    },
    {
        origem: 27,
        destino: 56,
        peso: 18.3
    },
    {
        origem: 27,
        destino: 66,
        peso: 18.9
    },
    {
        origem: 29,
        destino: 73,
        peso: 20.3
    },
    {
        origem: 30,
        destino: 55,
        peso: 32.1
    },
    {
        origem: 30,
        destino: 41,
        peso: 22.9
    },
    {
        origem: 30,
        destino: 90,
        peso: 28.8
    },
    {
        origem: 31,
        destino: 99,
        peso: 28.4
    },
    {
        origem: 31,
        destino: 44,
        peso: 15.3
    },
    {
        origem: 32,
        destino: 88,
        peso: 25.7
    },
    {
        origem: 33,
        destino: 66,
        peso: 17.1
    },
    {
        origem: 34,
        destino: 72,
        peso: 30.6
    },
    {
        origem: 34,
        destino: 80,
        peso: 26.5
    },
    {
        origem: 34,
        destino: 93,
        peso: 37.4
    },
    {
        origem: 35,
        destino: 53,
        peso: 14
    },
    {
        origem: 35,
        destino: 76,
        peso: 50.5
    },
    {
        origem: 36,
        destino: 57,
        peso: 8.4
    },
    {
        origem: 36,
        destino: 60,
        peso: 15.7
    },
    {
        origem: 38,
        destino: 49,
        peso: 11.1
    },
    {
        origem: 38,
        destino: 78,
        peso: 20.8
    },
    {
        origem: 40,
        destino: 83,
        peso: 35.1
    },
    {
        origem: 42,
        destino: 59,
        peso: 19.6
    },
    {
        origem: 43,
        destino: 93,
        peso: 15
    },
    {
        origem: 43,
        destino: 98,
        peso: 16.5
    },
    {
        origem: 46,
        destino: 69,
        peso: 28.4
    },
    {
        origem: 46,
        destino: 94,
        peso: 20.2
    },
    {
        origem: 46,
        destino: 82,
        peso: 21.6
    },
    {
        origem: 46,
        destino: 51,
        peso: 24.1
    },
    {
        origem: 50,
        destino: 77,
        peso: 13.2
    },
    {
        origem: 51,
        destino: 22,
        peso: 20.4
    },
    {
        origem: 51,
        destino: 74,
        peso: 34.7
    },
    {
        origem: 52,
        destino: 96,
        peso: 17.8
    },
    {
        origem: 52,
        destino: 75,
        peso: 23.9
    },
    {
        origem: 54,
        destino: 79,
        peso: 39.3
    },
    {
        origem: 54,
        destino: 70,
        peso: 16.5
    },
    {
        origem: 55,
        destino: 58,
        peso: 21.4
    },
    {
        origem: 55,
        destino: 82,
        peso: 15.5
    },
    {
        origem: 57,
        destino: 60,
        peso: 11.4
    },
    {
        origem: 60,
        destino: 85,
        peso: 19.5
    },
    {
        origem: 60,
        destino: 89,
        peso: 11.8
    },
    {
        origem: 61,
        destino: 76,
        peso: 15
    },
    {
        origem: 65,
        destino: 67,
        peso: 17.3
    },
    {
        origem: 66,
        destino: 81,
        peso: 28.4
    },
    {
        origem: 67,
        destino: 89,
        peso: 35.3
    },
    {
        origem: 70,
        destino: 90,
        peso: 21.6
    },
    {
        origem: 70,
        destino: 92,
        peso: 21.3
    },
    {
        origem: 71,
        destino: 81,
        peso: 16.4
    },
    {
        origem: 71,
        destino: 101,
        peso: 19.9
    },
    {
        origem: 72,
        destino: 73,
        peso: 28.7
    },
    {
        origem: 74,
        destino: 94,
        peso: 16
    },
    {
        origem: 74,
        destino: 84,
        peso: 18.3
    },
    {
        origem: 74,
        destino: 91,
        peso: 37.2
    },
    {
        origem: 76,
        destino: 89,
        peso: 55.6
    },
    {
        origem: 77,
        destino: 85,
        peso: 11.7
    },
    {
        origem: 78,
        destino: 79,
        peso: 23.6
    },
    {
        origem: 80,
        destino: 93,
        peso: 50.3
    },
    {
        origem: 79,
        destino: 92,
        peso: 15.8
    },
    {
        origem: 83,
        destino: 91,
        peso: 19.8
    },
    {
        origem: 84,
        destino: 94,
        peso: 5.4
    },
    {
        origem: 86,
        destino: 100,
        peso: 27.5
    },
    {
        origem: 88,
        destino: 100,
        peso: 23.6
    },
    {
        origem: 96,
        destino: 97,
        peso: 16
    }

]
