
function postEnteredData() {

    var labelValues = getEnteredData();
    payload = {labels: labelValues, tags:Object.keys(labelValues[0])};

    $.ajax({
       type: 'POST',
       url: '/gallery',
       data : JSON.stringify(payload),
       contentType: "application/json",
       success: function(data) {
            console.log("success");
            console.log("Payload:", payload);
       },
       error: function(err) {
            console.log("POST error", err);
            console.log("Payload:", payload);
       }

   });

}

function getEnteredData() {
    
    var cardsContainer = document.getElementById("cards-container");
    var cards = cardsContainer.getElementsByClassName("card-parent");
    
    var props = [];
    for (var i = 0; i < cards.length; i++) {
        imageSrc = cards[i].getElementsByClassName("card-image")[0].getAttribute("src");
        labels = getImageLabels(cards[i]);
        props.push(labels);
    }
    return props;
}


function getImageLabels(cardItemNode) {

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
