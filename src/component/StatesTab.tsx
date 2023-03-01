import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService, } from "azure-devops-extension-api";

import { Button } from "azure-devops-ui/Button";
import { TextField } from "azure-devops-ui/TextField";
import { useEffect, useState } from "react";

export interface IExtensionDataState {
    dataText?: string;
    persistedText?: string;
    ready?: boolean;
}

export const StatesTab = () => {

    const [statesTab, setStatesTab] = useState<IExtensionDataState>({});

    let _dataManager: IExtensionDataManager | undefined;

    useEffect(() => {
        const initialize = async () => {
            await SDK.ready();
            const accessToken = await SDK.getAccessToken();
            const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
            _dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);

            _dataManager.getValue<string>("test-id").then((data) => {
                setStatesTab({
                    dataText: data,
                    persistedText: data,
                    ready: true
                });
            }, () => {
                setStatesTab({
                    dataText: "",
                    ready: true
                });
            });
        }

        initialize()
            .catch(console.error);
    }, []);

    const onTextValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string): void => {
        setStatesTab(current => {
            return { ...current, dataText: value }
        });
    };

    const onSaveData = (): void => {
        const { dataText } = statesTab;
        setStatesTab(current => {
            return { ...current, ready: false }
        });
        _dataManager!.setValue<string>("test-id", dataText || "").then(() => {
            setStatesTab(current => {
                return { ...current, persistedText: dataText, ready: true }
            });
        });
    }


    const { dataText, ready, persistedText } = statesTab;

    return (
        <div className="page-content page-content-top flex-row rhythm-horizontal-16">
            <TextField
                value={dataText}
                onChange={onTextValueChanged}
                disabled={!ready}
            />
            <Button
                text="Save"
                primary={true}
                onClick={onSaveData}
                disabled={!ready || dataText === persistedText}
            />
        </div>
    );

}