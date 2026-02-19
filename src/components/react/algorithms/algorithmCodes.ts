export const ALGORITHM_CODES = {
  'bubble-sort': {
    js: `function bubbleSort(arr) {
  const n = arr.length;

  // Percorre o array n-1 vezes
  for (let i = 0; i < n - 1; i++) {
    // A cada passada, o maior elemento "borbulha" para o final
    for (let j = 0; j < n - 1 - i; j++) {
      // Compara elementos adjacentes
      if (arr[j] > arr[j + 1]) {
        // Troca se estiverem fora de ordem
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
}`,
    py: `def bubble_sort(arr):
    n = len(arr)

    # Percorre o array n-1 vezes
    for i in range(n - 1):
        # A cada passada, o maior elemento "borbulha" para o final
        for j in range(n - 1 - i):
            # Compara elementos adjacentes
            if arr[j] > arr[j + 1]:
                # Troca se estiverem fora de ordem
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr`,
    cpp: `void bubbleSort(int arr[], int n) {
    // Percorre o array n-1 vezes
    for (int i = 0; i < n - 1; i++) {
        // A cada passada, o maior elemento "borbulha" para o final
        for (int j = 0; j < n - 1 - i; j++) {
            // Compara elementos adjacentes
            if (arr[j] > arr[j + 1]) {
                // Troca se estiverem fora de ordem
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
  },
  'quick-sort': {
    js: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Particiona o array e obtém a posição do pivô
    const pi = partition(arr, low, high);

    // Ordena recursivamente as duas metades
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  // Escolhe o último elemento como pivô
  const pivot = arr[high];
  let i = low - 1;

  // Reorganiza: menores que pivô à esquerda, maiores à direita
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      // Troca elemento menor para a posição correta
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Coloca o pivô na posição final correta
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    py: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low < high:
        # Particiona o array e obtém a posição do pivô
        pi = partition(arr, low, high)

        # Ordena recursivamente as duas metades
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

    return arr

def partition(arr, low, high):
    # Escolhe o último elemento como pivô
    pivot = arr[high]
    i = low - 1

    # Reorganiza: menores que pivô à esquerda, maiores à direita
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            # Troca elemento menor para a posição correta
            arr[i], arr[j] = arr[j], arr[i]

    # Coloca o pivô na posição final correta
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    cpp: `int partition(int arr[], int low, int high) {
    // Escolhe o último elemento como pivô
    int pivot = arr[high];
    int i = low - 1;

    // Reorganiza: menores que pivô à esquerda, maiores à direita
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            // Troca elemento menor para a posição correta
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    // Coloca o pivô na posição final correta
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // Particiona o array e obtém a posição do pivô
        int pi = partition(arr, low, high);

        // Ordena recursivamente as duas metades
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
  },
  'merge-sort': {
    js: `function mergeSort(arr) {
  // Caso base: array de 1 elemento já está ordenado
  if (arr.length <= 1) return arr;

  // Divide o array ao meio
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Combina as duas metades ordenadas
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  // Compara elementos das duas metades e insere o menor
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Copia os elementos restantes de cada metade
  return result.concat(left.slice(i), right.slice(j));
}`,
    py: `def merge_sort(arr):
    # Caso base: array de 1 elemento já está ordenado
    if len(arr) <= 1:
        return arr

    # Divide o array ao meio
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # Combina as duas metades ordenadas
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    # Compara elementos das duas metades e insere o menor
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Copia os elementos restantes de cada metade
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    cpp: `void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // Cria arrays temporários para as duas metades
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    // Compara elementos das duas metades e insere o menor
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    // Copia os elementos restantes de cada metade
    while (i < n1) { arr[k] = L[i]; i++; k++; }
    while (j < n2) { arr[k] = R[j]; j++; k++; }
}

void mergeSort(int arr[], int left, int right) {
    // Caso base: array de 1 elemento já está ordenado
    if (left < right) {
        int mid = left + (right - left) / 2;

        // Divide o array ao meio
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);

        // Combina as duas metades ordenadas
        merge(arr, left, mid, right);
    }
}`,
  },
  'binary-search': {
    js: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  // Continua enquanto houver espaço de busca
  while (low <= high) {
    // Calcula o índice do meio
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      // Elemento encontrado!
      return mid;
    } else if (arr[mid] < target) {
      // Descarta metade esquerda (valores menores)
      low = mid + 1;
    } else {
      // Descarta metade direita (valores maiores)
      high = mid - 1;
    }
  }

  // Elemento não encontrado
  return -1;
}`,
    py: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    # Continua enquanto houver espaço de busca
    while low <= high:
        # Calcula o índice do meio
        mid = (low + high) // 2

        if arr[mid] == target:
            # Elemento encontrado!
            return mid
        elif arr[mid] < target:
            # Descarta metade esquerda (valores menores)
            low = mid + 1
        else:
            # Descarta metade direita (valores maiores)
            high = mid - 1

    # Elemento não encontrado
    return -1`,
    cpp: `int binarySearch(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;

    // Continua enquanto houver espaço de busca
    while (low <= high) {
        // Calcula o índice do meio
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            // Elemento encontrado!
            return mid;
        } else if (arr[mid] < target) {
            // Descarta metade esquerda (valores menores)
            low = mid + 1;
        } else {
            // Descarta metade direita (valores maiores)
            high = mid - 1;
        }
    }

    // Elemento não encontrado
    return -1;
}`,
  },
  bfs: {
    js: `function bfs(graph, start) {
  const visited = new Set();
  // Fila FIFO para controlar a ordem de visita
  const queue = [start];

  while (queue.length > 0) {
    // Remove o primeiro da fila
    const node = queue.shift();

    if (visited.has(node)) continue;
    // Marca o nó como visitado
    visited.add(node);
    console.log("Visitando:", node);

    // Adiciona todos os vizinhos não visitados à fila
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
}

// Exemplo de grafo como lista de adjacência
const graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F", "G"],
  D: ["B", "H"],
  E: ["B"],
  F: ["C", "I"],
  G: ["C"],
  H: ["D"],
  I: ["F"],
};

bfs(graph, "A");`,
    py: `from collections import deque

def bfs(graph, start):
    visited = set()
    # Fila FIFO para controlar a ordem de visita
    queue = deque([start])

    while queue:
        # Remove o primeiro da fila
        node = queue.popleft()

        if node in visited:
            continue
        # Marca o nó como visitado
        visited.add(node)
        print(f"Visitando: {node}")

        # Adiciona todos os vizinhos não visitados à fila
        for neighbor in graph[node]:
            if neighbor not in visited:
                queue.append(neighbor)

# Exemplo de grafo como lista de adjacência
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F", "G"],
    "D": ["B", "H"],
    "E": ["B"],
    "F": ["C", "I"],
    "G": ["C"],
    "H": ["D"],
    "I": ["F"],
}

bfs(graph, "A")`,
    cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>
using namespace std;

void bfs(unordered_map<string, vector<string>>& graph,
         const string& start) {
    unordered_set<string> visited;
    // Fila FIFO para controlar a ordem de visita
    queue<string> q;
    q.push(start);

    while (!q.empty()) {
        // Remove o primeiro da fila
        string node = q.front();
        q.pop();

        if (visited.count(node)) continue;
        // Marca o nó como visitado
        visited.insert(node);
        cout << "Visitando: " << node << endl;

        // Adiciona todos os vizinhos não visitados à fila
        for (const string& neighbor : graph[node]) {
            if (!visited.count(neighbor)) {
                q.push(neighbor);
            }
        }
    }
}`,
  },
  dfs: {
    js: `function dfs(graph, start) {
  const visited = new Set();
  // Pilha LIFO para controlar a ordem de visita
  const stack = [start];

  while (stack.length > 0) {
    // Remove o último da pilha
    const node = stack.pop();

    if (visited.has(node)) continue;
    // Marca o nó como visitado
    visited.add(node);
    console.log("Visitando:", node);

    // Adiciona vizinhos não visitados à pilha
    // (invertemos para manter a ordem natural)
    for (const neighbor of graph[node].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
}

// Exemplo de grafo como lista de adjacência
const graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F", "G"],
  D: ["B", "H"],
  E: ["B"],
  F: ["C", "I"],
  G: ["C"],
  H: ["D"],
  I: ["F"],
};

dfs(graph, "A");`,
    py: `def dfs(graph, start):
    visited = set()
    # Pilha LIFO para controlar a ordem de visita
    stack = [start]

    while stack:
        # Remove o último da pilha
        node = stack.pop()

        if node in visited:
            continue
        # Marca o nó como visitado
        visited.add(node)
        print(f"Visitando: {node}")

        # Adiciona vizinhos não visitados à pilha
        # (invertemos para manter a ordem natural)
        for neighbor in reversed(graph[node]):
            if neighbor not in visited:
                stack.append(neighbor)

# Exemplo de grafo como lista de adjacência
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F", "G"],
    "D": ["B", "H"],
    "E": ["B"],
    "F": ["C", "I"],
    "G": ["C"],
    "H": ["D"],
    "I": ["F"],
}

dfs(graph, "A")`,
    cpp: `#include <iostream>
#include <vector>
#include <stack>
#include <unordered_set>
#include <unordered_map>
#include <algorithm>
using namespace std;

void dfs(unordered_map<string, vector<string>>& graph,
         const string& start) {
    unordered_set<string> visited;
    // Pilha LIFO para controlar a ordem de visita
    stack<string> s;
    s.push(start);

    while (!s.empty()) {
        // Remove o último da pilha
        string node = s.top();
        s.pop();

        if (visited.count(node)) continue;
        // Marca o nó como visitado
        visited.insert(node);
        cout << "Visitando: " << node << endl;

        // Adiciona vizinhos não visitados à pilha
        // (invertemos para manter a ordem natural)
        vector<string> neighbors = graph[node];
        reverse(neighbors.begin(), neighbors.end());
        for (const string& neighbor : neighbors) {
            if (!visited.count(neighbor)) {
                s.push(neighbor);
            }
        }
    }
}`,
  },
} as const;

export type AlgorithmCodeKey = keyof typeof ALGORITHM_CODES;
