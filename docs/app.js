// Generated by LiveScript 1.6.0
(function(){
  var c, getPriority, getPostJump, getContext, parseSnippetLine, flagsStringToObject, getContent, extractSnippet, escapeQuotes, generateSnippet, generateTabstop, generateCodeEmbed, generateTabstopReference, generateContentAssignement, generateTriggerRegexGroupReference, split$ = ''.split, join$ = [].join;
  c = console.log;
  getPriority = function(line){
    var pattern, priority;
    pattern = /^priority (\d+)$/;
    priority = Number(
    line.replace(pattern, '$1'));
    if (isNaN(
    priority)) {
      return null;
    } else {
      return priority;
    }
  };
  getPostJump = function(line){
    var pattern, postJump;
    pattern = /^post_jump (.+)$/;
    postJump = line.replace(pattern, '$1');
    if (postJump === line) {
      return null;
    } else {
      return postJump;
    }
  };
  getContext = function(line){
    var pattern, context;
    pattern = /^context (.+)$/;
    context = line.replace(pattern, '$1');
    if (context === line) {
      return null;
    } else {
      return context;
    }
  };
  parseSnippetLine = function(line){
    var pattern, groups;
    pattern = /^snippet (('(?<triggerQuoted>[^']+)')|(?<trigger>[^ ]+)) ("(?<name>[^"]+)")? (?<flags>[biwrtsmeA]+)?$/;
    groups = (pattern.exec(line) || {
      groups: null
    }).groups;
    if (groups == null) {
      return null;
    }
    return {
      flags: flagsStringToObject(
      groups.flags),
      trigger: groups.trigger || groups.triggerQuoted,
      name: groups.name
    };
  };
  flagsStringToObject = function(flagsString){
    var flagsObject, i$, ref$, len$, flag;
    flagsObject = {};
    for (i$ = 0, len$ = (ref$ = ['b', 'i', 'w', 'r', 't', 's', 'm', 'e', 'A']).length; i$ < len$; ++i$) {
      flag = ref$[i$];
      flagsObject[flag] = in$(flag, flagsString);
    }
    return flagsObject;
  };
  getContent = function(source){
    var contentLines, i$, ref$, len$, line, lineStartsWith;
    contentLines = [];
    for (i$ = 0, len$ = (ref$ = split$.call(source, '\n')).length; i$ < len$; ++i$) {
      line = ref$[i$];
      lineStartsWith = fn$;
      if (lineStartsWith('snippet')) {
        continue;
      }
      if (lineStartsWith('priority')) {
        continue;
      }
      if (lineStartsWith('post_jump')) {
        continue;
      }
      if (lineStartsWith('context')) {
        continue;
      }
      if (line.trim() === 'endsnippet') {
        continue;
      }
      contentLines.push(line);
    }
    return join$.call(contentLines, '\n');
    function fn$(it){
      return line.trimStart().startsWith(it + " ");
    }
  };
  extractSnippet = function(source){
    var priority, postJump, context, trigger, name, flags, content, seen, i$, ref$, len$, line, ref1$, snippet;
    priority = null;
    postJump = null;
    context = null;
    trigger = '';
    name = '';
    flags = {
      b: false,
      t: false,
      i: false,
      s: false,
      w: false,
      m: false,
      r: false,
      e: false,
      A: false
    };
    content = '';
    seen = {
      postJump: false,
      priority: false,
      context: false,
      snippetLine: false,
      endsnippet: false
    };
    for (i$ = 0, len$ = (ref$ = split$.call(source, '\n')).length; i$ < len$; ++i$) {
      line = ref$[i$];
      line = line.trim();
      if (line === 'endsnippet') {
        break;
      }
      if (!seen.snippetLine && parseSnippetLine(line) != null) {
        seen.postJump = seen.priority = seen.context = seen.snippetLine = true;
        ref1$ = parseSnippetLine(line), trigger = ref1$.trigger, name = ref1$.name, flags = ref1$.flags;
      } else if (!seen.priority && getPriority(line) != null) {
        priority = getPriority(line);
        seen.priority = true;
      } else if (!seen.context && getContext(line) != null) {
        context = getContext(line);
        seen.context = true;
      } else if (!seen.postJump && getPostJump(line) != null) {
        postJump = getPostJump(line);
        seen.postJump = true;
      }
    }
    content = getContent(source);
    snippet = {
      priority: priority,
      postJump: postJump,
      flags: flags,
      trigger: trigger,
      name: name,
      context: context,
      content: content
    };
    c('parsed', snippet);
    return snippet;
  };
  escapeQuotes = function(string){
    return string.replace(/(?<!\\)"/g, '\\"');
  };
  generateSnippet = function(arg$){
    var priority, postJump, flags, trigger, name, context, content, priorityString, contextString, postJumpString, flagsString, k, v, triggerString;
    priority = arg$.priority, postJump = arg$.postJump, flags = arg$.flags, trigger = arg$.trigger, name = arg$.name, context = arg$.context, content = arg$.content;
    priorityString = priority !== null ? "priority " + priority + "\n" : '';
    contextString = context !== null ? "context \"" + escapeQuotes(
    context) + "\"\n" : '';
    postJumpString = postJump !== null ? "post_jump \"" + escapeQuotes(
    postJump) + "\"\n" : '';
    flagsString = (function(){
      var i$, ref$, own$ = {}.hasOwnProperty, results$ = [];
      for (i$ in ref$ = flags) if (own$.call(ref$, i$)) {
        k = i$;
        v = ref$[i$];
        if (v) {
          results$.push((fn$.call(this, k, v)));
        }
      }
      return results$;
      function fn$(k, v){
        return k;
      }
    }.call(this)).join('');
    triggerString = flags.r ? "'" + trigger + "'" : trigger;
    return (priorityString + contextString + postJumpString + ("snippet " + triggerString + " \"" + name + "\" " + flagsString + "\n" + content + "\nendsnippet")).trim();
  };
  generateTabstop = function(arg$){
    var position, defaultValue, substitution, ref$, search, replace;
    position = arg$.position, defaultValue = arg$.defaultValue, substitution = arg$.substitution;
    if (defaultValue) {
      return "${" + position + ":" + defaultValue + "} ";
    } else if (substitution && substitution.length === 2) {
      ref$ = substitution.map(function(v){
        return v.replace(/(?<!\\)\//g, '\\/');
      }), search = ref$[0], replace = ref$[1];
      return "${" + position + "/" + search + "/" + replace + "/g} ";
    } else if (position) {
      return "$" + position + " ";
    }
  };
  generateCodeEmbed = function(arg$){
    var language, content, tag;
    language = arg$.language, content = arg$.content;
    tag = (function(){
      switch (language) {
      case 'shell':
        return '';
      case 'python':
        return '!p';
      case 'vimscript':
        return '!v';
      default:
        return null;
      }
    }());
    if (tag === null) {
      return null;
    }
    return "`" + tag + "\n\t" + content + "\n`";
  };
  generateTabstopReference = function(arg$){
    var language, position;
    language = arg$.language, position = arg$.position;
    switch (language) {
    case 'python':
      return "t[" + position + "] ";
    default:
      return null;
    }
  };
  generateContentAssignement = function(arg$){
    var language;
    language = arg$.language;
    switch (language) {
    case 'python':
      return 'snip.rv = ';
    default:
      return null;
    }
  };
  generateTriggerRegexGroupReference = function(arg$){
    var language, position;
    language = arg$.language, position = arg$.position;
    switch (language) {
    case 'python':
      return "match.group(" + position + ") ";
    default:
      return null;
    }
  };
  if (typeof window !== 'undefined') {
    window.generateSnippet = generateSnippet;
    window.extractSnippet = extractSnippet;
    window.generateTabstop = generateTabstop;
    window.generateTabstopReference = generateTabstopReference;
    window.generateTriggerRegexGroupReference = generateTriggerRegexGroupReference;
    window.generateContentAssignement = generateContentAssignement;
    window.generateCodeEmbed = generateCodeEmbed;
  }
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
