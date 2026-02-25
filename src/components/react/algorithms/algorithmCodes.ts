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
    // (cópia invertida para manter a ordem natural)
    for (const neighbor of [...graph[node]].reverse()) {
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
  'two-sum': {
    js: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    // Calcula o complemento necessário
    const complement = target - nums[i];

    // Verifica se o complemento já foi visto
    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    // Armazena o valor atual e seu índice
    map.set(nums[i], i);
  }

  return [];
}`,
    py: `def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        # Calcula o complemento necessário
        complement = target - num

        # Verifica se o complemento já foi visto
        if complement in seen:
            return [seen[complement], i]

        # Armazena o valor atual e seu índice
        seen[num] = i

    return []`,
    cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        // Calcula o complemento necessário
        int complement = target - nums[i];

        // Verifica se o complemento já foi visto
        if (seen.count(complement)) {
            return {seen[complement], i};
        }

        // Armazena o valor atual e seu índice
        seen[nums[i]] = i;
    }

    return {};
}`,
  },
  'hash-table': {
    js: `class HashTable {
  constructor(size = 7) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }

  hash(key) {
    let h = 0;
    for (const ch of key) h = (h + ch.charCodeAt(0)) % this.size;
    return h;
  }

  set(key, value) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    // Verifica se a chave já existe (atualiza)
    const existing = bucket.find(([k]) => k === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }

  get(key) {
    const idx = this.hash(key);
    const pair = this.buckets[idx].find(([k]) => k === key);
    return pair ? pair[1] : undefined;
  }
}`,
    py: `class HashTable:
    def __init__(self, size=7):
        self.buckets = [[] for _ in range(size)]
        self.size = size

    def _hash(self, key):
        h = 0
        for ch in key:
            h = (h + ord(ch)) % self.size
        return h

    def set(self, key, value):
        idx = self._hash(key)
        bucket = self.buckets[idx]
        # Verifica se a chave já existe (atualiza)
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key):
        idx = self._hash(key)
        for k, v in self.buckets[idx]:
            if k == key:
                return v
        return None`,
    cpp: `#include <vector>
#include <string>
#include <list>
using namespace std;

class HashTable {
    int size;
    vector<list<pair<string, string>>> buckets;

    int hash(const string& key) {
        int h = 0;
        for (char ch : key) h = (h + ch) % size;
        return h;
    }

public:
    HashTable(int sz = 7) : size(sz), buckets(sz) {}

    void set(const string& key, const string& value) {
        int idx = hash(key);
        // Verifica se a chave já existe (atualiza)
        for (auto& [k, v] : buckets[idx]) {
            if (k == key) { v = value; return; }
        }
        buckets[idx].push_back({key, value});
    }

    string get(const string& key) {
        int idx = hash(key);
        for (auto& [k, v] : buckets[idx]) {
            if (k == key) return v;
        }
        return "";
    }
};`,
  },
  'two-pointers': {
    js: `function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      // Soma muito pequena, avança esquerda
      left++;
    } else {
      // Soma muito grande, recua direita
      right--;
    }
  }

  return [-1, -1];
}`,
    py: `def two_sum_sorted(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left < right:
        total = numbers[left] + numbers[right]

        if total == target:
            return [left, right]
        elif total < target:
            # Soma muito pequena, avança esquerda
            left += 1
        else:
            # Soma muito grande, recua direita
            right -= 1

    return [-1, -1]`,
    cpp: `#include <vector>
using namespace std;

vector<int> twoSumSorted(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;

    while (left < right) {
        int sum = numbers[left] + numbers[right];

        if (sum == target) {
            return {left, right};
        } else if (sum < target) {
            // Soma muito pequena, avança esquerda
            left++;
        } else {
            // Soma muito grande, recua direita
            right--;
        }
    }

    return {-1, -1};
}`,
  },
  'sliding-window': {
    js: `function maxSumSubarray(arr, k) {
  let windowSum = 0;

  // Soma da primeira janela
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  let maxSum = windowSum;

  // Desliza a janela
  for (let i = k; i < arr.length; i++) {
    // Remove elemento que saiu, adiciona novo
    windowSum = windowSum - arr[i - k] + arr[i];

    // Atualiza o máximo
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}`,
    py: `def max_sum_subarray(arr, k):
    window_sum = 0

    # Soma da primeira janela
    for i in range(k):
        window_sum += arr[i]
    max_sum = window_sum

    # Desliza a janela
    for i in range(k, len(arr)):
        # Remove elemento que saiu, adiciona novo
        window_sum = window_sum - arr[i - k] + arr[i]

        # Atualiza o máximo
        max_sum = max(max_sum, window_sum)

    return max_sum`,
    cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxSumSubarray(vector<int>& arr, int k) {
    int windowSum = 0;

    // Soma da primeira janela
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int maxSum = windowSum;

    // Desliza a janela
    for (int i = k; i < arr.size(); i++) {
        // Remove elemento que saiu, adiciona novo
        windowSum = windowSum - arr[i - k] + arr[i];

        // Atualiza o máximo
        maxSum = max(maxSum, windowSum);
    }

    return maxSum;
}`,
  },
  'prefix-sum': {
    js: `function buildPrefixSum(arr) {
  const prefix = [0];

  // Constrói o array de prefix sum
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i]);
  }

  return prefix;
}

// Consulta de range em O(1)
function rangeSum(prefix, left, right) {
  return prefix[right + 1] - prefix[left];
}`,
    py: `def build_prefix_sum(arr):
    prefix = [0]

    # Constrói o array de prefix sum
    for i in range(len(arr)):
        prefix.append(prefix[i] + arr[i])

    return prefix

# Consulta de range em O(1)
def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]`,
    cpp: `#include <vector>
using namespace std;

vector<int> buildPrefixSum(vector<int>& arr) {
    vector<int> prefix = {0};

    // Constrói o array de prefix sum
    for (int i = 0; i < arr.size(); i++) {
        prefix.push_back(prefix[i] + arr[i]);
    }

    return prefix;
}

// Consulta de range em O(1)
int rangeSum(vector<int>& prefix, int left, int right) {
    return prefix[right + 1] - prefix[left];
}`,
  },
  'reverse-list': {
    js: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    // Salva o próximo nó
    const next = curr.next;

    // Inverte o ponteiro
    curr.next = prev;

    // Avança prev e curr
    prev = curr;
    curr = next;
  }

  // prev é o novo head
  return prev;
}`,
    py: `def reverse_list(head):
    prev = None
    curr = head

    while curr is not None:
        # Salva o próximo nó
        next_node = curr.next

        # Inverte o ponteiro
        curr.next = prev

        # Avança prev e curr
        prev = curr
        curr = next_node

    # prev é o novo head
    return prev`,
    cpp: `struct ListNode {
    int val;
    ListNode* next;
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;

    while (curr != nullptr) {
        // Salva o próximo nó
        ListNode* next = curr->next;

        // Inverte o ponteiro
        curr->next = prev;

        // Avança prev e curr
        prev = curr;
        curr = next;
    }

    // prev é o novo head
    return prev;
}`,
  },
  'valid-parentheses': {
    js: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if ('([{'.includes(ch)) {
      // Abertura: push na stack
      stack.push(ch);
    } else {
      // Fechamento: verifica match
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[ch]) {
        return false;
      }
      // Match: pop da stack
      stack.pop();
    }
  }

  // Válido se stack vazia
  return stack.length === 0;
}`,
    py: `def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for ch in s:
        if ch in '([{':
            # Abertura: push na stack
            stack.append(ch)
        else:
            # Fechamento: verifica match
            if not stack or stack[-1] != pairs[ch]:
                return False
            # Match: pop da stack
            stack.pop()

    # Válido se stack vazia
    return len(stack) == 0`,
    cpp: `#include <stack>
#include <string>
#include <unordered_map>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {
        {')', '('}, {']', '['}, {'}', '{'}
    };

    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') {
            // Abertura: push na stack
            st.push(ch);
        } else {
            // Fechamento: verifica match
            if (st.empty() || st.top() != pairs[ch]) {
                return false;
            }
            // Match: pop da stack
            st.pop();
        }
    }

    // Válido se stack vazia
    return st.empty();
}`,
  },
  'bst-traversal': {
    js: `function inOrderTraversal(root) {
  const result = [];

  function inOrder(node) {
    if (node === null) return;

    // Visita subárvore esquerda
    inOrder(node.left);

    // Processa o nó atual
    result.push(node.val);

    // Visita subárvore direita
    inOrder(node.right);
  }

  inOrder(root);
  return result; // Retorna valores em ordem crescente
}`,
    py: `def in_order_traversal(root):
    result = []

    def in_order(node):
        if node is None:
            return

        # Visita subárvore esquerda
        in_order(node.left)

        # Processa o nó atual
        result.append(node.val)

        # Visita subárvore direita
        in_order(node.right)

    in_order(root)
    return result  # Retorna valores em ordem crescente`,
    cpp: `#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
};

vector<int> inOrderTraversal(TreeNode* root) {
    vector<int> result;

    function<void(TreeNode*)> inOrder = [&](TreeNode* node) {
        if (!node) return;

        // Visita subárvore esquerda
        inOrder(node->left);

        // Processa o nó atual
        result.push_back(node->val);

        // Visita subárvore direita
        inOrder(node->right);
    };

    inOrder(root);
    return result; // Retorna valores em ordem crescente
}`,
  },
  'heap-insert': {
    js: `class MinHeap {
  constructor() { this.heap = []; }

  insert(val) {
    // Adiciona no final
    this.heap.push(val);

    // Bubble up: troca com pai enquanto menor
    let idx = this.heap.length - 1;
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent] <= this.heap[idx]) break;
      // Troca com o pai
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }
}`,
    py: `class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, val):
        # Adiciona no final
        self.heap.append(val)

        # Bubble up: troca com pai enquanto menor
        idx = len(self.heap) - 1
        while idx > 0:
            parent = (idx - 1) // 2
            if self.heap[parent] <= self.heap[idx]:
                break
            # Troca com o pai
            self.heap[parent], self.heap[idx] = self.heap[idx], self.heap[parent]
            idx = parent`,
    cpp: `#include <vector>
#include <algorithm>
using namespace std;

class MinHeap {
    vector<int> heap;

public:
    void insert(int val) {
        // Adiciona no final
        heap.push_back(val);

        // Bubble up: troca com pai enquanto menor
        int idx = heap.size() - 1;
        while (idx > 0) {
            int parent = (idx - 1) / 2;
            if (heap[parent] <= heap[idx]) break;
            // Troca com o pai
            swap(heap[parent], heap[idx]);
            idx = parent;
        }
    }
};`,
  },
  'trie-insert': {
    js: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;

    for (const ch of word) {
      // Cria nó se não existe
      if (!(ch in node.children)) {
        node.children[ch] = new TrieNode();
      }
      // Avança para o filho
      node = node.children[ch];
    }

    // Marca fim de palavra
    node.isEnd = true;
  }
}`,
    py: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root

        for ch in word:
            # Cria nó se não existe
            if ch not in node.children:
                node.children[ch] = TrieNode()
            # Avança para o filho
            node = node.children[ch]

        # Marca fim de palavra
        node.is_end = True`,
    cpp: `#include <unordered_map>
#include <string>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root;

public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* node = root;

        for (char ch : word) {
            // Cria nó se não existe
            if (!node->children.count(ch)) {
                node->children[ch] = new TrieNode();
            }
            // Avança para o filho
            node = node->children[ch];
        }

        // Marca fim de palavra
        node->isEnd = true;
    }
};`,
  },
  subsets: {
    js: `function subsets(nums) {
  const result = [];

  function backtrack(start, current) {
    // Adiciona o subset atual ao resultado
    result.push([...current]);

    // Tenta incluir cada elemento restante
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);      // escolha
      backtrack(i + 1, current);   // explora
      current.pop();               // desfaz (backtrack)
    }
  }

  backtrack(0, []);
  return result;
}`,
    py: `def subsets(nums):
    result = []

    def backtrack(start, current):
        # Adiciona o subset atual ao resultado
        result.append(current[:])

        # Tenta incluir cada elemento restante
        for i in range(start, len(nums)):
            current.append(nums[i])      # escolha
            backtrack(i + 1, current)     # explora
            current.pop()                 # desfaz (backtrack)

    backtrack(0, [])
    return result`,
    cpp: `#include <vector>
using namespace std;

class Solution {
    vector<vector<int>> result;

    void backtrack(vector<int>& nums, int start, vector<int>& current) {
        // Adiciona o subset atual ao resultado
        result.push_back(current);

        // Tenta incluir cada elemento restante
        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);      // escolha
            backtrack(nums, i + 1, current); // explora
            current.pop_back();              // desfaz (backtrack)
        }
    }

public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<int> current;
        backtrack(nums, 0, current);
        return result;
    }
};`,
  },
  'climbing-stairs': {
    js: `function climbStairs(n) {
  // Cria tabela DP
  const dp = new Array(n + 1);

  // Casos base
  dp[0] = 1; // 1 forma de ficar parado
  dp[1] = 1; // 1 forma de subir 1 degrau

  // Preenche bottom-up
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}`,
    py: `def climb_stairs(n):
    # Cria tabela DP
    dp = [0] * (n + 1)

    # Casos base
    dp[0] = 1  # 1 forma de ficar parado
    dp[1] = 1  # 1 forma de subir 1 degrau

    # Preenche bottom-up
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]`,
    cpp: `#include <vector>
using namespace std;

int climbStairs(int n) {
    // Cria tabela DP
    vector<int> dp(n + 1);

    // Casos base
    dp[0] = 1; // 1 forma de ficar parado
    dp[1] = 1; // 1 forma de subir 1 degrau

    // Preenche bottom-up
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}`,
  },
  'interval-scheduling': {
    js: `function intervalScheduling(intervals) {
  // Ordena por tempo de fim
  intervals.sort((a, b) => a[1] - b[1]);

  const selected = [];
  let lastEnd = -Infinity;

  for (const [start, end] of intervals) {
    // Se não conflita com o último selecionado
    if (start >= lastEnd) {
      // Seleciona esta atividade
      selected.push([start, end]);
      lastEnd = end;
    }
  }

  return selected;
}`,
    py: `def interval_scheduling(intervals):
    # Ordena por tempo de fim
    intervals.sort(key=lambda x: x[1])

    selected = []
    last_end = float('-inf')

    for start, end in intervals:
        # Se não conflita com o último selecionado
        if start >= last_end:
            # Seleciona esta atividade
            selected.append([start, end])
            last_end = end

    return selected`,
    cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> intervalScheduling(
    vector<vector<int>>& intervals) {
    // Ordena por tempo de fim
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b) { return a[1] < b[1]; });

    vector<vector<int>> selected;
    int lastEnd = INT_MIN;

    for (auto& interval : intervals) {
        // Se não conflita com o último selecionado
        if (interval[0] >= lastEnd) {
            // Seleciona esta atividade
            selected.push_back(interval);
            lastEnd = interval[1];
        }
    }

    return selected;
}`,
  },
  'merge-intervals': {
    js: `function mergeIntervals(intervals) {
  // Ordena por start
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];

    // Verifica overlap
    if (intervals[i][0] <= last[1]) {
      // Merge: estende o end
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      // Sem overlap: novo intervalo
      merged.push(intervals[i]);
    }
  }

  return merged;
}`,
    py: `def merge_intervals(intervals):
    # Ordena por start
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for i in range(1, len(intervals)):
        last = merged[-1]

        # Verifica overlap
        if intervals[i][0] <= last[1]:
            # Merge: estende o end
            last[1] = max(last[1], intervals[i][1])
        else:
            # Sem overlap: novo intervalo
            merged.append(intervals[i])

    return merged`,
    cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(
    vector<vector<int>>& intervals) {
    // Ordena por start
    sort(intervals.begin(), intervals.end());

    vector<vector<int>> merged = {intervals[0]};

    for (int i = 1; i < intervals.size(); i++) {
        auto& last = merged.back();

        // Verifica overlap
        if (intervals[i][0] <= last[1]) {
            // Merge: estende o end
            last[1] = max(last[1], intervals[i][1]);
        } else {
            // Sem overlap: novo intervalo
            merged.push_back(intervals[i]);
        }
    }

    return merged;
}`,
  },
  'single-number': {
    js: `function singleNumber(nums) {
  let result = 0;

  // XOR de todos os elementos
  for (const num of nums) {
    result ^= num;
  }

  // Duplicados se cancelam (a^a=0)
  // Resta apenas o único
  return result;
}`,
    py: `def single_number(nums):
    result = 0

    # XOR de todos os elementos
    for num in nums:
        result ^= num

    # Duplicados se cancelam (a^a=0)
    # Resta apenas o único
    return result`,
    cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;

    // XOR de todos os elementos
    for (int num : nums) {
        result ^= num;
    }

    // Duplicados se cancelam (a^a=0)
    // Resta apenas o único
    return result;
}`,
  },
  'topo-sort': {
    js: `function topologicalSort(numNodes, edges) {
  // Constrói grafo e calcula in-degrees
  const adj = Array.from({length: numNodes}, () => []);
  const inDegree = new Array(numNodes).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }

  // Enfileira nós com in-degree 0
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    // Reduz in-degree dos vizinhos
    for (const neighbor of adj[node]) {
      inDegree[neighbor]--;
      // Se in-degree chega a 0, enfileira
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return order;
}`,
    py: `from collections import deque

def topological_sort(num_nodes, edges):
    # Constrói grafo e calcula in-degrees
    adj = [[] for _ in range(num_nodes)]
    in_degree = [0] * num_nodes

    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1

    # Enfileira nós com in-degree 0
    queue = deque()
    for i in range(num_nodes):
        if in_degree[i] == 0:
            queue.append(i)

    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        # Reduz in-degree dos vizinhos
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            # Se in-degree chega a 0, enfileira
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return order`,
    cpp: `#include <vector>
#include <queue>
using namespace std;

vector<int> topologicalSort(int numNodes,
    vector<pair<int,int>>& edges) {
    // Constrói grafo e calcula in-degrees
    vector<vector<int>> adj(numNodes);
    vector<int> inDegree(numNodes, 0);

    for (auto& [u, v] : edges) {
        adj[u].push_back(v);
        inDegree[v]++;
    }

    // Enfileira nós com in-degree 0
    queue<int> q;
    for (int i = 0; i < numNodes; i++) {
        if (inDegree[i] == 0) q.push(i);
    }

    vector<int> order;

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);

        // Reduz in-degree dos vizinhos
        for (int neighbor : adj[node]) {
            inDegree[neighbor]--;
            // Se in-degree chega a 0, enfileira
            if (inDegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    return order;
}`,
  },
} as const;

export type AlgorithmCodeKey = keyof typeof ALGORITHM_CODES;
