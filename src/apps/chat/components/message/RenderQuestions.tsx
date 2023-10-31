import { Box, Button, IconButton, Tooltip, Typography } from '@mui/joy';
import { QuestionBlock } from './Block';


export const RenderQuestions = (props: { messageId: string, questionBlock: QuestionBlock, runExample: (example: string) => void }) =>
  {

    
    const splitString = props.questionBlock.question.split("Questions:- ");

  return (

    <Box>

      <Typography
        color='neutral'
        sx={{
          lineHeight: 1.75,
          mx: 1.5,
          display: 'flex', alignItems: 'baseline',
          overflowWrap: 'anywhere',
          whiteSpace: 'break-spaces',
          
        }}
      >
        {splitString[0]}
      </Typography>  

      < Typography level='body-lg' color='neutral' sx={{
            mt: 2, 
          }} >
            { <> Choose suggested questions to continue. </> }
        
        </Typography >
      

      <br />

      {splitString[1].split('\n').map((selectedExample) => (

      (selectedExample !== 'Related Questions:- ' && selectedExample !== ' ' && selectedExample !== '' 
        ? <>
          
      
          {<Button  sx={{ textAlign: 'left', mb:1}} variant='outlined' onClick={() => props.runExample(selectedExample)} color='neutral' size='md'>{selectedExample}</Button>  }
            
          <br />
          </> 
            : ''
          )   

      ))} 

 

   
    </Box>


  )

}
  