import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Divider } from '@mui/joy';

import { GoodModal } from '~/common/components/GoodModal';
import { useUIStateStore } from '~/common/state/store-ui';

import { DModelSourceId } from '../llm.types';
import { EditSources } from './EditSources';
import { LLMList } from './LLMList';
import { LLMOptions } from './LLMOptions';
import { VendorSourceSetup } from './VendorSourceSetup';
import { createDefaultModelSource, createModelSource } from '../vendor.registry';
import { useModelsStore, useSourceSetup } from '../store-llms';
import { localAIToDLLM } from '../gpt4all/GPT4ALLSourceSetup';
import { openAIModelToDLLM } from '../openai/OpenAISourceSetup';
import { apiQuery } from '~/modules/trpc/trpc.client';
import { normalizeOAISetup } from '../openai/openai.vendor';


export function Configurator() {

  // local state
  const [_selectedSourceId, setSelectedSourceId] = React.useState<DModelSourceId | null>(null);

  // external state
  const { modelsSetupOpen, openModelsSetup, closeModelsSetup, llmOptionsId } = useUIStateStore();
  const { modelSources, addModelSource,llmCount } = useModelsStore(state => ({
    modelSources: state.sources,
    llmCount: state.llms.length,
    addModelSource: state.addSource, removeModelSource: state.removeSource,
  }), shallow);

  // auto-select the first source - note: we could use a useEffect() here, but this is more efficient
  // also note that state-persistence is unneeded
  const selectedSourceId = _selectedSourceId ?? modelSources[0]?.id ?? null;

  const activeSource = modelSources.find(source => source.id === selectedSourceId); 

  const modelSource = createModelSource('gpt4allloraq4', modelSources);

  // external state
  const {
    source, sourceLLMs, updateSetup,
    normSetup: { heliKey, oaiHost, oaiKey, oaiOrg, moderationCheck },
  } = useSourceSetup('openai', normalizeOAISetup);

  const { isFetching, refetch, isError } = apiQuery.openai.listModels.useQuery({ oaiKey, oaiHost, oaiOrg, heliKey, moderationCheck  }, {
    onSuccess: models => {
      const llms = source ? models.map(model => openAIModelToDLLM(model, source)) : [];
      useModelsStore.getState().addLLMs(llms);
    },
    staleTime: Infinity,
  });


  // add the default source on cold - will require setup
  React.useEffect(() => {
    const { addSource, sources } = useModelsStore.getState();
    if (!selectedSourceId) {
      console.log('Model Source: %o', modelSource)
      useModelsStore.getState().addLLMs(modelSource ?localAIToDLLM(modelSource ): []);

    }
    if (!sources.length) {
      addSource(createDefaultModelSource(sources));
      //refetch()
      addModelSource(modelSource);
      
    }
      
  }, [selectedSourceId, modelSource, addModelSource]);


  return <>

    {/* Sources Setup */}
    <GoodModal title={<>Configure <b>AI Models</b> <br></br>Pick a model from list below and click close</>} open={modelsSetupOpen} onClose={closeModelsSetup}>

      <EditSources selectedSourceId={selectedSourceId} setSelectedSourceId={setSelectedSourceId} />

      {!!activeSource && <Divider />}

      

       {!!activeSource && <VendorSourceSetup source={activeSource} />} 

      {!!llmCount && <Divider />}

      

      {!!llmCount && <LLMList />}

      <Divider />

    </GoodModal>

    {/* per-LLM options */}
    {!!llmOptionsId && <LLMOptions id={llmOptionsId} />}

  </>;
}

