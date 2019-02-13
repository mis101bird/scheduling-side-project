import Immutable from 'immutable';


// returns true if node i is higher priority than j in the given heap
// ~2log_{32}(n)
const __isHigherPriority__ = (heap, i, j) => heap.get(i).get('priority') - heap.get(j).get('priority') > 0;

// returns a new heap in which the values at index i and j are swaped
// overall operation costs ~4log_{32}(n)
const __swap__ = (heap, i, j) => {
  // O(log n)
  let temp = heap.get(i);
  // get: O(log n) then set: O(log n) then read temp O(log n) then set: O(log n)
  return heap.set(i, heap.get(j)).set(j, temp);
};

// PRIVATE HELPER: bubbles node i up the binary tree based on priority until heap conditions are restored
const __bubble__ = (heap, node) => {
  let i = node;
  let nHeap = heap;

  // while the index of the element is greater than 1 and it has higher priority compared to it's parent exchange them.
  // Complexity analysis: loop executions log_{2}(n), __isHigherPriority__: ~2log_{32}(n), __swap__: ~4log_{32}(n)
  // log_{2}(n) * 6log_{32}(n) = O((log n)^2)
  while (i > 1 && __isHigherPriority__(nHeap, i >> 1, i)) {
    nHeap = __swap__(nHeap, i, i >> 1);
    i >>= 1;
  }
  return nHeap;
};

// Sinks a low priority element down to it's place until the heap invarient is restored.
// Complexity analysis: loop executions log_{2}(n), __isHigherPriority__: ~2log_{32}(n), __swap__: ~4log_{32}(n)
// log_{2}(n) * 8log_{32}(n) = O((log n)^2)
const __sink__ = (heap, nodeIndex) => {
  let node = nodeIndex;
  let nHeap = heap;

  // while ith node has a child
  while (node * 2 < nHeap.size) {
    let child = 2 * node;

    // pick the child with the higher priority
    if (child < nHeap.size - 1 && __isHigherPriority__(nHeap, child, child + 1)) {
      child += 1;
    }
    // compare priority to it's parent
    if (!(__isHigherPriority__(nHeap, node, child))) {
      break;
    }
    // swap if parent has low priority
    nHeap = __swap__(nHeap, node, child);
    node = child;
  }
  return nHeap;
};

/**
 * The Constructor for the priority queue.
 * Using the Heap Implementation which performs push, pull in lograthmic time.
 */
class PriorityQueue {
  constructor(heap) {
    this.__heap__ = heap ? heap : Immutable.List([ null ]);
  }

  /**
   * Comparision operator for the PriorityQueue
   *
   * @param  { PriorityQueue } that [ the priority queue against which the comparision is to be made ]
   * @return { boolean }      [ true/false depending on the success/failure of the comparision between this and that ]
   */
  equals = that => this.__heap__.equals(that.__heap__)

  /**
   * Push a data entry(with a given priority) into the priority queue.
   * Takes time equivalent to O((log n)**2) where n is the number of elements
   * currently in the queue.
   *
   * @param  {Object} data     [ the content ]
   * @param  {nulber} priority [ the priority of the content ]
   * @return {null}          [ A new PriorityQueue with the new data entry ]
   */
  push(data, priority) {
    // let node = new Node(data, priority);
    let node = Immutable.Map({ value: data, priority: priority });

    // append the element to the end of the list and then __bubble__ it
    // up to its place.
    return new PriorityQueue(__bubble__(this.__heap__.push(node), this.__heap__.size));
  }

  /**
   * Removes and returns the data of highest priority (i.e. one with the
   * lowest value).
   * Takes time proportional to O((log n)**2).
   *
   * @return {Object} [the object with the max priority (i.e. the one with the minimum value for priority)]
   */
  pop() {
    // throw an error if list is [null].
    if (this.__heap__.size < 2) {
      throw new Error('Underflow');
    }

    // pop the last element and put it on the top then __sink__ it down hence
    //  maintaining the heap invarient.
    return new PriorityQueue(__sink__(this.__heap__.set(1, this.__heap__.last()).pop(), 1));
  }

  /**
   * Returns the element with the maximum priority in the heap in O(log_{32}(n)).
   *
   * @return {T} [ The element with maximum priority ]
   */
  peek() {
    // throw an error if list is [null].
    if (this.__heap__.size < 2) {
      throw new Error('Underflow');
    }

    return this.__heap__.get(1).get('value');
  }
}

export default PriorityQueue;