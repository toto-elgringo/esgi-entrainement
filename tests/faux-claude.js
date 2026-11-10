const args = process.argv.slice(2);
const prompt = args[args.indexOf('-p') + 1] ?? '';
const supports = prompt.split('\n').filter((ligne) => ligne.startsWith('- ')).length;

console.log(JSON.stringify({ type: 'system', subtype: 'init' }));
console.log(JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'Je lis les sources' }] } }));

if (args.includes('--attendre')) {
  setInterval(() => {}, 1000);
} else if (args.includes('--echouer')) {
  console.log(JSON.stringify({ type: 'result', is_error: true, result: 'Plantage' }));
} else {
  console.log(JSON.stringify({ type: 'result', is_error: false, result: `Bilan : ${supports} notes` }));
}
