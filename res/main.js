const query = `
  query Objkt($id: bigint!) {
    hic_et_nunc_token_by_pk(id: $id) {
      artifact_uri
      creator {
        address
        name
      }
      description
      display_uri
      id
      level
      mime
      royalties
      supply
      thumbnail_uri
      metadata
      timestamp
      title
      token_tags(order_by: {id: asc}) {
        tag {
          tag
        }
      }
      swaps(order_by: {id: asc}) {
        price
        timestamp
        status
        amount
        amount_left
        creator {
          address
          name
        }
      }
      trades(order_by: {timestamp: asc}) {
        amount
        buyer {
          address
          name
        }
        seller {
          address
          name
        }
        swap {
          price
        }
        timestamp
      }
      token_holders(where: {quantity: {_gt: "0"}}, order_by: {id: asc}) {
        quantity
        holder {
          address
          name
        }
      }
      hdao_balance
      extra
    }
  }
`;

const loader = `<div id="load">
        <div class="spinner-grow text-dark spinner-grow-xl" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`
window.onload=function(){
  var objkid = document.getElementById('objID')
  objkid.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("button-addon2").click();
    }
  })
}
async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://api.hicdex.com/v1/graphql",
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

async function doFetch() {
    
  var obj__id = document.getElementById('objID').value;
  
  var ID_JKT = {}
  ID_JKT.id = obj__id
  document.querySelector('.root').innerHTML = loader
  const { errors, data } = await fetchGraphQL(query, "Objkt", ID_JKT);
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token_by_pk

  var thumbnail__ = result.artifact_uri
  var thumbnail = thumbnail__.substr(7)
  for (var i = 0; i < result.swaps.length; i++) {
    var amt = result.swaps[i].amount
    var amt_lft = result.swaps[i].amount_left
  }
  var tktags = ''
  for (var j = 0; j < result.token_tags.length; j++) {
    tktags += `
        <span class="badge bg-light text-dark">${result.token_tags[j].tag.tag}</span>`
  }
  var tag__ = tktags
  var the_buyers = ''
  for (var k = 0; k < result.trades.length; k++) {
    the_buyers += `
        <tbody>
            <tr>
              <td colspan="2" scope="row">${result.trades[k].amount}</th>
              <td><a href="https://www.hicetnunc.xyz/tz/${result.trades[k].buyer.address}">${result.trades[k].buyer.name} (${result.trades[k].buyer.address})</a></td>
            </tr>
        </tbody>`
  }
  let objwid = `
  <div class="card">
    <img src="https://ipfs.io/ipfs/${thumbnail}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${result.title}</h5>
      <a href="https://www.hicetnunc.xyz/tz/${result.creator.address}" class="card-subtitle">${result.creator.name}</a>
      <p class="card-text">${result.description}</p>
      <a href="https://www.hicetnunc.xyz/objkt/${result.id}" class="btn btn-primary">View on H=N</a>
      <a href="#" class="btn btn-primary" id="share">Share</a>
    </div>
    <h5 class="card-header">Swaps and other info</h5>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b>Available: ${amt_lft}</b>
        </li>
        <li class="list-group-item">
          <b>Supply: ${amt}</b>
        </li>
        <li class="list-group-item">
          <b>MIME: ${result.mime}</b>
        </li>
        <li class="list-group-item"><b>Tags</b><br>${tktags}
        </li>
      </ul>
      <div class="table-responsive">
        <table class="table table-light">        <thead>
            <tr class="card-header">
              <th colspan="2" scope="col">Trade</th>
              <th scope="col">Quantity</th>
            </tr>
      
          </thead>
          ${the_buyers}
        </table>
      </div>
  </div>
  `
  document.querySelector('.root').innerHTML = objwid
  
  const shareData = {
    title: `${result.title}`,
    url: `https://www.hicetnunc.xyz/objkt/${result.id}`,
  }
  
  const btnS = document.querySelector('#share');
  
  // Must be triggered some kind of "user activation"
  btnS.addEventListener('click', async () => {
    try {
      await navigator.share(shareData)
      
    } catch (err) {
      console.log('Error: ' + err)
    }
  });
  
  return result
}

