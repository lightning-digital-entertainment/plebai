import { Button, Divider, Typography } from "@mui/joy";
import { DetailModal } from "~/common/components/DetailModal";





export function SubscriptionModal(props: { open: boolean,  onClose: () => void, }) {



    return (

        <DetailModal title={'Monthly Subscription'} open={props.open} onClose={props.onClose}>
            
        <Divider />
    
        <Typography level='body-lg' color='primary' sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {"Unlock endless possibilities with our Monthly Subscription! Get unlimited access to text and image generation using any AI agent at no additional cost."
}
        </Typography>

        <Typography level='body-sm' color='neutral' sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {"Imagine the freedom to create, explore, and innovate without limits. Whether for personal projects, professional work, or just for fun, our subscription opens up a world of creativity and efficiency. Don't miss out on this opportunity to enhance your digital experience. Remember...AI won’t replace humans, humans that use AI will replace humans."
}
        </Typography>
    
        <Typography level='body-md' color='primary' sx={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
          Our price:  <span style={{ textDecoration: 'line-through' }}>12,000 Sats</span>{" Limited Time Offer: 9,000 Sats!"}
        </Typography>
    
        <Button variant="solid" color="primary" sx={{ marginTop: 3 }}>
            Subscribe Now
        </Button>
    
    </DetailModal>
    

    


    )


}