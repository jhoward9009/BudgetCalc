let db

const request = indexedDB.open('tracker', 1)

request.onupgradeneeded = function(event) {
    const db = event.target.result

    db.createObjectStore('data', {autoIncrement: true})
}

request.onsuccess = function (event) {

    db = event.target.result
// if online functionality run code to upload saved data
    if(navigator.onLine){
        pullbudget()
    }


}

request.onerror = function (err) {
    console.log(e.target.errorCode)
}




function saveRecord(record){

    const transaction = db.transaction (['data'], 'readwrite')

    const dataObjectStore = transaction.objectStore('data')

    dataObjectStore.add(record)
}

function pullbudget() {
    const transaction =db.transaction(['data'], 'readwrite')
    const dataObjectStore = transaction.objectStore('data')
   
    const getallitems = dataObjectStore.getallitems()

    getallitems.onsuccess = function () {

        if (getallitems.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body:JSON.stringify(getallitems.result),
                headers: {  
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'},
            })
            .then(response => response.json())

            .then(serverResponse => {
                if (serverResponse.message){
                    throw new error(serverResponse)
                }

                const transaction = db.transaction(['data'], 'readwrite')
                const dataObjectStore = transaction.objectStore('data')
                dataObjectStore.clear()

                alert(' The app has been updated!')
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}

window.addEventListener('online', pullbudget);
