
export function aStar ( grid, startNode, finishNode ) { // props - grid, startNode, finishNode
    console.log(grid)
    const nodesChecked = []
    const chosen = []
    startNode.distance = 0
    startNode.finishDistance = heuristic(startNode, finishNode)
    startNode.total = startNode.distance + startNode.finishDistance
      
    nodesChecked.push(startNode)

    while( !!nodesChecked.length){
        sortNodes(nodesChecked)
        let current = nodesChecked.shift()
        console.log(current)
        if(current.isWall) continue        
        if(current.distance===Infinity) return []
        chosen.push(current)
        if(current.isFinish) return chosen
        const neighbours = getNeighbours(current, grid)
        for(const n of neighbours){
         if(!chosen.includes(n)){
             if(!nodesChecked.includes(n)){
                 nodesChecked.push(n)
             }else  if(n.distance <= current.distance + 1) continue
         n.distance = current.distance + 1              
         n.finishDistance = heuristic(n, finishNode)
         n.total = n.distance + n.finishDistance
         n.previous = current         
         }          
        }     
   }
   return []
   
}
   
   function updateNeighbours (node, finishNode, nodesChecked, chosen , grid){
       const neighbours = getNeighbours(node, grid)
       for(const n of neighbours){
        if(!chosen.includes(node)){
            if(!nodesChecked.includes(node)){
                nodesChecked.push(n)
            }else  if(n.distance <= node.distance + 1) continue
        n.distance = node.distance + 1              
        n.finishDistance = heuristic(n, finishNode)
        n.total = n.distance + n.finishDistance
        n.previous = node         
        }          
       }       
   }
   
   function getNeighbours (closestNode, grid){
       //console.log('closest', closestNode)
       const neighbours = []
       const {row, col} = closestNode
       if( row>0 ) neighbours.push(grid[row-1][col])
       if( row < grid.length-1 ) neighbours.push(grid[row+1][col])
       if( col > 0 ) neighbours.push(grid[row][col-1])
       if( col < grid[0].length-1 ) neighbours.push(grid[row][col+1])
       return neighbours
   }
   
   function getAllNodes(grid, finishNode){
       const nodes=[]   
       for(let i=0; i<grid.length;i++){
           for(let j=0; j<grid[i].length; j++){            
            grid[i][j].finishDistance = heuristic(grid[i][j], finishNode)
            
    
             nodes.push(grid[i][j])
           }
         }
       //  console.log('nodes---', nodes)
         return nodes
   }
   function sortNodes(unvisited){
       unvisited.sort((a,b)=>
           a.total-b.total
       )
   }
   export function getShortPathA(finishNode){
       //console.log('shortPath - FN', finishNode)
       const shortPath = []
         let current = finishNode
         
         while(current !== null ){
           shortPath.unshift(current)
           current = current.previous
       
         }
         return shortPath
     }
    function heuristic( node1, node2){
        let d1 = Math.abs(node1.row - node2.row)
        let d2 = Math.abs(node1.col - node2.col)
       // console.log(d1, d2, d1+d2)
        return d1+d2
    } 