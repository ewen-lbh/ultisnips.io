// Generated by LiveScript 1.6.0
(function(){
  var getPriority, getPostJump, getContext, parseSnippetLine, flagsStringToObject, getContent, extractSnippet, generateSnippet, generateTabstop, generateCodeEmbed, generateTabstopReference, generateContentAssignement, generateTriggerRegexGroupReference, split$ = ''.split;
  getPriority = function(line){
    var pattern, priority;
    pattern = /^priority (\d+)$/;
    priority = Number(
    line.replace(pattern, '$1'));
    if (isNaN(priority)) {
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
    if (groups === null) {
      return {
        flags: null,
        trigger: null,
        name: null
      };
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
      flagsObject[flag] = flagsString.includes(flag);
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
    return contentLines.join('\n');
    function fn$(it){
      return line.trimStart().startsWith(it + " ");
    }
  };
  extractSnippet = function(source){
    var i$, ref$, len$, line, priority, postJump, ref1$, flags, trigger, name, context, content;
    for (i$ = 0, len$ = (ref$ = split$.call(source, '\n')).length; i$ < len$; ++i$) {
      line = ref$[i$];
      line = line.trim();
      console.log(line);
      priority || (priority = getPriority(line));
      postJump || (postJump = getPostJump(line));
      ref1$ = parseSnippetLine(line), flags || (flags = ref1$.flags), trigger || (trigger = ref1$.trigger), name || (name = ref1$.name);
      context || (context = getContext(line));
    }
    content = getContent(source);
    return {
      priority: priority,
      postJump: postJump,
      flags: flags,
      trigger: trigger,
      name: name,
      context: context,
      content: content
    };
  };
  generateSnippet = function(arg$){
    var priority, postJump, flags, trigger, name, context, content, prorityString, contextString, postJumpString, flagsString;
    priority = arg$.priority, postJump = arg$.postJump, flags = arg$.flags, trigger = arg$.trigger, name = arg$.name, context = arg$.context, content = arg$.content;
    prorityString = priority !== null ? "prority " + priority + "\n" : '';
    contextString = context !== null ? "context " + context + "\n" : '';
    postJumpString = postJump !== null ? "post_jump " + postJump + "\n" : '';
    flagsString = Object.entries(flags).filter(function(arg$){
      var k, v;
      k = arg$[0], v = arg$[1];
      return v;
    }).map(function(arg$){
      var k, v;
      k = arg$[0], v = arg$[1];
      return k;
    }).join('');
    return (prorityString + contextString + postJumpString + ("snippet '" + trigger + "' \"" + name + "\" " + flagsString + "\n" + content + "\nendsnippet")).trim();
  };
  generateTabstop = function(arg$){
    var position, defaultValue, substitution, ref$, search, replace;
    position = arg$.position, defaultValue = arg$.defaultValue, substitution = arg$.substitution;
    if (position === 0) {
      return '$0';
    } else if (defaultValue) {
      return "${" + position + ":" + defaultValue + "}";
    } else if (substitution && substitution.length === 2) {
      ref$ = substitution.map(function(v){
        return v.replace(/(?<!\\)\//g, '\\/');
      }), search = ref$[0], replace = ref$[1];
      return "${" + position + "/" + search + "/" + replace + "/g}";
    }
  };
  generateCodeEmbed = function(arg$){
    var language, content;
    language = arg$.language, content = arg$.content;
    switch (language) {
    case 'shell':
      return "`\n" + content + "\n`";
    case 'python':
      return "`!p\n" + content + "\n`";
    case 'vimscript':
      return "`!v\n" + content + "\n`";
    default:
      return null;
    }
  };
  generateTabstopReference = function(arg$){
    var language, position;
    language = arg$.language, position = arg$.position;
    switch (language) {
    case 'python':
      return "t[" + position + "}]";
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
      return "match.group(" + position + ")";
    default:
      return null;
    }
  };
  if (typeof window !== 'undefined') {
    window.generateSnippet = generateSnippet;
    window.extractSnippet = extractSnippet;
    window.generateTabstop = generateTabstop;
    window.generateTriggerRegexGroupReference = generateTriggerRegexGroupReference;
    window.generateContentAssignement = generateContentAssignement;
  }
  /*TESTING
  original = '''
  priority 1000
  snippet 'sympy(.*)sympy' "sympy" wr
  `!p
  from sympy import *
  x, y, z, t = symbols('x y z t')
  k, m, n = symbols('k m n', integer=True)
  f, g, h = symbols('f g h', cls=Function)
  init_printing()
  snip.rv = eval('latex(' + match.group(1).replace('\\', '').replace('^', '**').replace('{', '(').replace('}', ')') + ')')
  `
  endsnippet
  '''
  snippet = extract-snippet original
  generated = generate-snippet snippet
  
  sep = -> console.log '-' * 46
  console.log original
  sep()
  console.log snippet
  sep()
  console.log generated
  
  generate-tabstop(
      position: 2
      default-value: null
      substitution: ['this:\\/\\/url', 'hey-hey!!!/']
  ) |> console.log
  */
}).call(this);
