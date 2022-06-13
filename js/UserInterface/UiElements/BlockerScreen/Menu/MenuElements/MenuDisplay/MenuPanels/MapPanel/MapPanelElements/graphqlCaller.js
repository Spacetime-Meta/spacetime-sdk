const DEFAULT_SRC = 'https://raw.githubusercontent.com/Spacetime-Meta/spacetime-metadata/main/defaultChunk.json'

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://balanced-bulldog-49.hasura.app/v1/graphql",
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

const operationsDoc = (minX, maxX, minY, maxY, minZ, maxZ) => { return `
query MyQuery {
  spaceState_v3 (where: {x: {_gte: ${minX}, _lte: ${maxX}}, y: {_gte: ${minY}, _lte: ${maxY}}, z: {_gte: ${minZ}, _lte: ${maxZ}}}){
    planet
    image
    loc
    logo
    name
    portal
  }
}
`};

function fetchMySector(minX, maxX, minY, maxY, minZ, maxZ) {
  return fetchGraphQL(
    operationsDoc(minX, maxX, minY, maxY, minZ, maxZ),
    "MyQuery",
    {}
  );
}

async function getSpaceSector(minX, maxX, minY, maxY, minZ, maxZ) {
    const spaceState = {}
    var defaultdata;
    fetch(DEFAULT_SRC)
        .then(response => { return response.json() })
        .then(jsondata => { defaultdata = jsondata })

    const { errors, data } = await fetchMySector(minX, maxX, minY, maxY, minZ, maxZ);

    if(errors) { console.error(errors) }

    for(var i=0 ; i<data.spaceState_v3.length; i++){
        const entry = data.spaceState_v3[i]
        spaceState[entry.loc] = Object.assign({}, defaultdata)
        
        spaceState[entry.loc]["location"] =  {
            "x": parseInt(entry.loc.split(',')[0]),
            "y": parseInt(entry.loc.split(',')[1]),
            "z": parseInt(entry.loc.split(',')[2])
        }

        if(entry.name !== "") {
          spaceState[entry.loc]['name'] = entry.name
        }

        if(entry.portal !== "") {
          spaceState[entry.loc]['portal'] = entry.portal
        } else {
            spaceState[entry.loc]['portal'] = "https://stdkit-dev.netlify.app/examples/terrain-generation/index.html?x="+entry.loc.split(',')[0]+"&y="+entry.loc.split(',')[1]+"&z="+entry.loc.split(',')[2]
        }

        if(entry.image !== "") {
          spaceState[entry.loc]['image'] = entry.image
        }        

        if(entry.planet !== "") {
          spaceState[entry.loc]['planet'] = entry.planet
        }
    }
    return spaceState;
}

export {getSpaceSector}
