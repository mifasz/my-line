(function(){
  var quizForm = document.getElementById('quizForm');
  var resultBtn = document.getElementById('resultBtn');
  var resultDiv = document.getElementById('result');
  var recommendationDiv = document.getElementById('recommendation');

  resultBtn.addEventListener('click', function(){
    var q1 = quizForm.querySelector('input[name="q1"]:checked');
    var q2 = quizForm.querySelector('input[name="q2"]:checked');
    var q3 = quizForm.querySelector('input[name="q3"]:checked');
    var q4 = quizForm.querySelector('input[name="q4"]:checked');

    if(!q1 || !q2 || !q3 || !q4) {
      alert('すべての質問に回答してください。');
      return;
    }

    var ansQ1 = q1.value;
    var ansQ2 = q2.value;
    var ansQ3 = q3.value;
    var ansQ4 = q4.value;

    // ファイル名例: cost_fast_scalable_small.json
    var fileName = ansQ1 + "_" + ansQ2 + "_" + ansQ3 + "_" + ansQ4 + ".json";
    var url = "results/" + fileName;

    // 結果表示クリア
    recommendationDiv.innerHTML = "";

    fetch(url)
      .then(function(resp){
        if(!resp.ok) {
          // ファイルが無ければデフォルトメッセージ
          return Promise.reject("No file found");
        }
        return resp.json();
      })
      .then(function(data){
        data.results.forEach(function(rec){
          addRecommendation(rec.title, rec.serviceName, rec.descList);
        });
        resultDiv.style.display = 'block';
      })
      .catch(function(){
        addRecommendation("情報なし", "N/A", ["指定パターンの結果情報が見つかりませんでした。"]);
        resultDiv.style.display = 'block';
      });

    function addRecommendation(title, serviceName, descList) {
      var box = document.createElement('div');
      box.className = 'recommendation-box';

      var h3 = document.createElement('h3');
      h3.textContent = title;
      box.appendChild(h3);

      var p = document.createElement('p');
      p.innerHTML = "<strong>サービス例：</strong>" + serviceName;
      box.appendChild(p);

      var ul = document.createElement('ul');
      descList.forEach(function(item){
        var li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      box.appendChild(ul);
      recommendationDiv.appendChild(box);
    }
  });
})();
