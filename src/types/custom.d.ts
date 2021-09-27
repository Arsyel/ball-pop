import { AssetType } from "../ts/info/AssetType";

export declare namespace CustomTypes {

    type CONFIG = {
        VERSION: string;
        MODE: 'SANDBOX' | 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
        ENABLE_LOG: boolean;
        ON_DEBUG: boolean;
        ENABLE_PHYSICS_DEBUG: boolean;
        BASE_ASSET_URL: string;
    }

    namespace General {

        type FunctionWithParams = (...args: unknown[]) => void

        type FunctionNoParam = () => void

        type KeyValuePair<K, V> = {
            key: K;
            value: V;
        }

    }

    namespace Asset {

        type BaseAssetInfoType = {
            key: string;
            type: AssetType;
        }

        type AssetInfoType = BaseAssetInfoType & {
            url: string | string[];
            width?: number;
            height?: number;
            config?: object;
        }

        type AnimationInfoType = BaseAssetInfoType & {
            spritesheetRef: string;
            start: number;
            end: number;
            frameSpeed: number;
            loop?: true;
        }

        interface ObjectAsset {
            [key: string]: AssetInfoType
        }

        interface AnimationAsset {
            [key: string]: AnimationInfoType
        }

    }

    namespace Gameplay {

        type GameData = {
            timer: number;
            maxLiveBall: number;
        }

        type GeneralData = {
            screenRatio: number;
        }

        type BallCollection = Map<string, Phaser.Physics.Matter.Sprite>;

    }

}