(function(){
  var currentQuestion = 1;
  var totalQuestions = 4;
  var nextBtn = document.getElementById('nextBtn');
  var resultBtn = document.getElementById('resultBtn');
  var prevBtn = document.getElementById('prevBtn');
  var resetBtn = document.getElementById('resetBtn');
  var resultDiv = document.getElementById('result');
  var quizForm = document.getElementById('quizForm');
  var progressIndicator = document.getElementById('progressIndicator');
  var recommendationDiv = document.getElementById('recommendation');
  var allResultsBtn = document.getElementById('allResultsBtn');
  var allResultsDiv = document.getElementById('allResults');

  var answers = {};

  function updateProgress() {
    if (currentQuestion <= totalQuestions) {
      progressIndicator.textContent = "質問 " + currentQuestion + "/" + totalQuestions;
    } else {
      progressIndicator.textContent = "すべて回答済み";
    }
  }

  function showQuestion(n) {
    var questions = quizForm.querySelectorAll('.question');
    questions.forEach(function(q){
      q.classList.remove('active');
    });
    var target = quizForm.querySelector('.question[data-question="'+n+'"]');
    if(target) {
      target.classList.add('active');
    }
    updateProgress();

    if(n > 1) {
      prevBtn.style.display = 'inline-block';
    } else {
      prevBtn.style.display = 'none';
    }

    if(n > totalQuestions) {
      nextBtn.style.display = 'none';
      resultBtn.style.display = 'inline-block';
    } else {
      nextBtn.style.display = 'inline-block';
      resultBtn.style.display = 'none';
    }
  }

  function storeAnswer(qNum) {
    var currentQ = quizForm.querySelector('.question[data-question="'+qNum+'"]');
    if(!currentQ) return;
    var input = currentQ.querySelector('input[type="radio"]:checked');
    if(input) {
      answers["q"+qNum] = input.value;
    }
  }

  nextBtn.addEventListener('click', function(){
    var currentQ = quizForm.querySelector('.question[data-question="'+currentQuestion+'"]');
    if(currentQ) {
      var inputs = currentQ.querySelectorAll('input[type="radio"]');
      var answered = false;
      for(var i=0; i<inputs.length; i++){
        if(inputs[i].checked) { answered = true; break; }
      }
      if(!answered) {
        alert('回答を選択してください');
        return;
      }
      storeAnswer(currentQuestion);
    }
    currentQuestion++;
    if(currentQuestion > totalQuestions) {
      nextBtn.style.display = 'none';
      resultBtn.style.display = 'inline-block';
      progressIndicator.textContent = "すべて回答済み";
    } else {
      showQuestion(currentQuestion);
    }
  });

  prevBtn.addEventListener('click', function(){
    if(currentQuestion > 1) {
      storeAnswer(currentQuestion);
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  });

  resetBtn.addEventListener('click', function(){
    currentQuestion = 1;
    answers = {};
    var allRadio = quizForm.querySelectorAll('input[type="radio"]');
    allRadio.forEach(function(r){
      r.checked = false;
    });
    showQuestion(currentQuestion);
    resultDiv.style.display = 'none';
    recommendationDiv.innerHTML = "";
    allResultsDiv.style.display = 'none';
  });

  resultBtn.addEventListener('click', function(){
    for(var i=1; i<=totalQuestions; i++){
      storeAnswer(i);
    }

    var q1 = answers.q1;  
    var q2 = answers.q2;  
    var q3 = answers.q3;  
    var q4 = answers.q4;  

    recommendationDiv.innerHTML = "";

    // ファイル名パターン: q1_q2_q3_q4 例: cost_fast_scalable_small
    var fileName = q1 + "_" + q2 + "_" + q3 + "_" + q4 + ".json";
    var url = "results/" + fileName;

    fetch(url)
      .then(function(response){
        if(!response.ok) {
          // 万が一ファイルがない場合はfallback
          return Promise.reject("ファイルが見つかりません: " + url);
        }
        return response.json();
      })
      .then(function(data){
        // data.results配列を想定
        data.results.forEach(function(rec){
          addRecommendation(rec.title, rec.serviceName, rec.descList);
        });
        resultDiv.style.display = 'block';
      })
      .catch(function(){
        // 該当ファイルなしの場合、デフォルトメッセージ表示
        addRecommendation("参考情報なし","N/A",["該当パターンに対する詳細情報がありませんでした。"]);
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

  showQuestion(1);

  allResultsBtn.addEventListener('click', function(){
    allResultsDiv.style.display = (allResultsDiv.style.display === 'none') ? 'block' : 'none';
  });
})();
