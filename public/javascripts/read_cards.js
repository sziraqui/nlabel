
function postEnteredData() {

    var labels = getEnteredData();

    $.ajax({
       type: 'post',
       url: '/gallery',
       data : {"labels": labels,
                "tags": Object.keys(labels[0])},
       dataType: 'json',
       success: function(data) {
            console.log("success");
       },
       error: function(err) {
            console.log(err);
       }

   });

}

function getEnteredData(){
    
    var cardsContainer = document.getElementById("cards-container");
    var cards = cardsContainer.getElementsByClassName("card-parent");
    
    var props = [];
    for (var i = 0; i < cards.length; i++) {
        imageSrc = cards[i].getElementsByClassName("card-image")[0].getAttribute("src");
        labels = getImageLabels(cards[i]);
        props.push(labels);
    }
    alert(JSON.stringify(props));
    return props;
}


function getImageLabels(cardItemNode){

    var tags = cardItemNode.getElementsByClassName("tag-list-item");

    var name;
    var value;
    labels = {};
    for (var i = 0; i < tags.length; i++) {
        tagItem = tags[i];

        name = tagItem.getElementsByClassName("tag-name")[0];
        value = tagItem.getElementsByClassName("tag-input")[0];
        labels[String(name.innerHTML)] = String(value.value);
    }
    return labels;
}
