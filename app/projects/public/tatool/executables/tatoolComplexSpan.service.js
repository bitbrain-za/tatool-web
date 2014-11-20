'use strict';

tatool
  .factory('tatoolComplexSpan', [ '$rootScope', '$log', 'tatoolExecutable', 'db', 'timerService', 'tatoolPhase', 'tatoolStimulusService', 'tatoolInputService',
    function ($rootScope, $log, tatoolExecutable, db, timerService, tatoolPhase, tatoolStimulusService, tatoolInputService) {  

    // Define our executable service constructor which will be called once for every instance
    var ComplexNumExecutable = tatoolExecutable.createExecutable();

    ComplexNumExecutable.prototype.init = function() {
      $log.debug('Initialize Executable with name: ' + this.name);
      this.stimulusText = '';
      this.startTime = 0;
      this.endTime = 0;
      this.phase = 'INIT';
   
      this.trial = {};
      this.trial.correctResponse = null;
      this.trial.givenResponse = null;
      this.trial.reactionTime = 0;
      this.trial.score = null;

      this.stimulus = tatoolStimulusService.createStimulus();
      this.input = tatoolInputService.createInput();

      this.timerDisplayMemoranda = timerService.createTimer(800, true, this);
      this.timerIntervalMemoranda = timerService.createTimer(400, false, this);
    };

    ComplexNumExecutable.prototype.createStimulus = function() {
      // reset executable properties
      this.digits = [];
      this.memCounter = 1;
      this.respCounter = 0;

      // generate new list of digits
      this.generateDigits();
    };

    ComplexNumExecutable.prototype.setStimulus = function(memCounter) {
      this.stimulus.setText({ stimulusValue: this.digits[memCounter - 1] });
    };

    ComplexNumExecutable.prototype.setRecallStimulus = function(text) {
      this.stimulus.setText({ stimulusValue: text });
    };

    ComplexNumExecutable.prototype.generateDigits = function() {
      for (var i = 0; i < 3; i++) {
        var tmpNumber = 10 + (Math.floor((Math.random() * 90) + 1));
        if (this.digits.indexOf(tmpNumber) === -1) {
          this.digits.push(tmpNumber);
        } else {
          i--;
        }
      }
    };

    ComplexNumExecutable.prototype.getPhase = function() {
      return this.phase;
    };

    ComplexNumExecutable.prototype.setPhase = function(phase) {
      this.phase = phase;
    };

    // 5. Process given response and stop executable
    ComplexNumExecutable.prototype.addTrial = function(givenResponse) {
      this.trial.reactionTime = this.endTime - this.startTime;
      this.trial.givenResponse = givenResponse;
      this.trial.correctResponse = this.digits[this.respCounter - 1];

      if (this.trial.correctResponse == this.trial.givenResponse) {
        this.trial.score = 1;
      } else {
        this.trial.score = 0;
      }

      return db.saveTrial(this.trial);
    };

    ComplexNumExecutable.prototype.stopExecution = function() {
      tatoolExecutable.stop();
    };

    // Return our service object
    return ComplexNumExecutable;

  }]);