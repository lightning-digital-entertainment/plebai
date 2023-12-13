import { Box, Button, Divider, Typography } from "@mui/joy";
import { Invoice } from "alby-tools";
import React from "react";
import { DetailModal } from "~/common/components/DetailModal";
import { NoWebLnModal } from "~/common/components/NoWebLnModal";
import { requestOutputSchema } from "~/modules/current/request.router";
import { verifyOutputSchema } from "~/modules/current/verify.router";
import Wallet_Service from "~/modules/webln/wallet";
import { v4 as uuidv4 } from 'uuid';





export function SubscriptionModal(props: { open: boolean,  onClose: () => void, }) {

    const [qrCodeText, setQrCodeText] = React.useState('');
    const [openNoWebLnModal, setOpenNoWebLnModal] = React.useState(false);
    const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
    const [subExpiryDate, setSubExpiryDate] = React.useState(0);
    

    const userPubkey:any = localStorage.getItem('userPubkey');

    const handleNoWeblnClose = () => setOpenNoWebLnModal(false);

    const subpost = async () => {

        const currentDate = new Date();
        const newDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // Adding 30 days in milliseconds

        const event = {
          app_user_id: userPubkey,
          transaction_id: uuidv4(),
          product_id: "amped1mon",
          environment: "PRODUCTION",
          expiration_at_ms: newDate.getTime(),
          type: "PLEBAI",

        }


        return await fetch('/api/current/subpost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({event})
      });

    }

    const verifySubscription = React.useCallback(async () => {


        const url =  '/subscribers/' + userPubkey;

        const verifyResponse = await fetch('/api/current/subcheck', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({url})
        });
        try {

            const result = await verifyResponse?.json();

            if (result?.active) {

                setSubExpiryDate(result.expires);
                setOpenSuccessModal(true);
                localStorage.setItem('subexpiry', result.expires);
            } else {
                setSubExpiryDate(1);

        }
            
        } catch (error) {
            console.log(error);
        }
        


    }, [userPubkey]);

    React.useEffect(() => {

        if (subExpiryDate === 0) verifySubscription();

    },[subExpiryDate, verifySubscription])

    

    const getDateAfter30Days = (): string => {
        const today = new Date();
        const resultDate = new Date(subExpiryDate * 1000);
   
        // Format the date according to browser's locale
        return resultDate.toLocaleDateString();
    };
    

    const handleSubscription = async () => {

        Wallet_Service.getWebln()
            .then(async webln => {

                const response = await fetch('/api/current/request', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({'amtinsats': 9000*1000,'nip05':'plebai@getcurrent.io' })
                });
                const payResponse  = await response.json();
                const { pr, verify } = requestOutputSchema.parse(payResponse);
                if (!webln) {
                    console.log('no webln detected')
                    setQrCodeText(pr);
                    setOpenNoWebLnModal(true);
                    let settle=false;
                    let count=0;
                    do {
                      count++;
                      const verifyResponse = await fetch('/api/current/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({'verifyUrl': verify })
                      });
                      const verifyResponseParsed  = await verifyResponse.json();
                      const { preimage, settled } = verifyOutputSchema.parse(verifyResponseParsed);
                      console.log('preimage from verify url: %o', preimage)
                      
                      if (settled) {

                        //Invoice Success
                        await subpost();
                        
                        setOpenNoWebLnModal(false);
                        await verifySubscription();
                        settle=true;
                      }
                      if (count>180) settle=true;
                      console.log(count);

                    } while (!settle)  
                    
                } else {
                  try {

                    console.log('webln found')
                    
                    
                    
                    
                    const weblnResponse = await webln.sendPayment(pr);
                    let settle=false;
                    if (weblnResponse) {

                        do {

                          console.log('Payment Response: %o', weblnResponse.preimage)
                          const invoice = new Invoice({pr: pr, preimage: weblnResponse.preimage});
                          settle = await invoice.isPaid();

                          if (settle) {
                            //Invoice Success
                               
                            await subpost();

                            await verifySubscription();
                            setOpenSuccessModal(true);
                          }

                        } while (!settle)
                        
                    }
                  

                    
                  } catch (error) {

                    console.log('webln catch: %o', error)
                    //setOpenNoWebLnModal(true);
                    
                  }
                  


                }
                

              })


        
    }



    return (<>

    <DetailModal title={'Monthly Subscription'} open={props.open} onClose={props.onClose}>
            
        <Divider />
    
        {openSuccessModal? 

        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1,
        justifyContent: 'center',alignItems: 'center'}}>
                
               
            
                        <Typography level="body-lg" id="simple-modal-description"  sx={{ marginTop: 4 }}>
                        Congrats...! You are subscribed to unlimited text, image and video Generation until {getDateAfter30Days()}
                        </Typography>
                        <Button sx={{ marginTop: 4, justifyContent: 'center',alignItems: 'center' }} onClick={props.onClose}>Close</Button>
             

         </Box>
         :
         <Box sx={{display: 'flex', flexDirection: 'column', gap: 1,
         justifyContent: 'center',alignItems: 'center'}}>
                    <Typography level='body-lg' color='primary' sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {"Unlock endless possibilities with our Monthly Subscription! Get unlimited access to text,image and video generation using any AI agent at no additional cost."
                }
                    </Typography>

                    <Typography level='body-sm' color='neutral' sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {"Imagine the freedom to create, explore, and innovate without limits. Whether for personal projects, professional work, or just for fun, our subscription opens up a world of creativity and efficiency. Don't miss out on this opportunity to enhance your digital experience. Remember...AI won’t replace humans, humans that use AI will replace humans."
                }
                    </Typography>
                    
                    <Typography level='body-md' color='primary' sx={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                        Our price:  <span style={{ textDecoration: 'line-through' }}>12,000 Sats</span>{" Limited Time Offer: 9,000 Sats!"}
                    </Typography>
                    
                    <Button variant="solid" color="primary" onClick={handleSubscription} sx={{ marginTop: 3 }}>
                            Subscribe Now
                    </Button>


         </Box>
         
        
        }

    
    </DetailModal>
    
    <NoWebLnModal
          open={openNoWebLnModal} onClose={handleNoWeblnClose}  qrText= {qrCodeText}
          
        />
    


    </> )


}


