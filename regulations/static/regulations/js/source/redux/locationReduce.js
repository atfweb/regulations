const ACTIVE_LOCATION = 'ACTIVE_LOCATION';
const initialState = { section: '', paragraph: '' };

export function locationActiveEvt(paragraph) {
  const payload = { paragraph };
  if(paragraph === undefined || paragraph === null){
    payload.section = '';
    return { type: '', payload };
  }else if(paragraph.indexOf('-') !== -1){
    const parts = paragraph.split('-');
    payload.section = parts.slice(0, 2).join('-');
    return { type: ACTIVE_LOCATION, payload };
  }else{
    payload.section = paragraph;
    return { type: ACTIVE_LOCATION, payload };
  }  
  
}

export default function locationReduce(state = initialState, action) {
  if (action.type === ACTIVE_LOCATION) {
    return action.payload;
  }
  return state;
}
