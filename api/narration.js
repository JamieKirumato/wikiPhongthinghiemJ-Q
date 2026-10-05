// Create a Vietnamese MP3 for a teacher-written segment. No text is logged or retained.
export function splitNarration(text,limit=180){
  const chunks=[];let current='';
  for(const word of text.trim().split(/\s+/)){
    if(word.length>limit)throw new Error('Một từ quá dài.');
    if(current.length+word.length+1>limit){chunks.push(current);current=word;}
    else current+=(current?' ':'')+word;
  }
  if(current)chunks.push(current);return chunks;
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');res.statusCode=405;res.end('Chỉ hỗ trợ POST.');return;}
  try{
    let body=req.body;
    if(body===undefined){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>8192)throw new Error('Nội dung quá dài.');}body=JSON.parse(raw);}
    if(typeof body==='string')body=JSON.parse(body);
    const text=body?.text;
    if(typeof text!=='string'||!text.trim()||text.length>600){res.statusCode=400;res.end('Lời dẫn cần từ 1 đến 600 ký tự.');return;}
    const chunks=splitNarration(text),audio=[];
    for(const chunk of chunks){
      const query=new URLSearchParams({ie:'UTF-8',client:'tw-ob',tl:'vi',q:chunk});
      const response=await fetch('https://translate.google.com/translate_tts?'+query,{headers:{'User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(12000)});
      if(!response.ok||!response.headers.get('content-type')?.includes('audio'))throw new Error('Không tạo được giọng đọc.');
      audio.push(Buffer.from(await response.arrayBuffer()));
    }
    const mp3=Buffer.concat(audio);if(mp3.length<1000)throw new Error('Bản đọc chưa hoàn chỉnh.');
    res.setHeader('Content-Type','audio/mpeg');res.statusCode=200;res.end(mp3);
  }catch{res.statusCode=502;res.end('Chưa tạo được giọng Việt. Hãy thử lại; kịch bản đã lưu vẫn được giữ nguyên.');}
}
