import { AssetType } from "../ts/info/AssetType";

export declare namespace CustomTypes {

    type CONFIG = {
        VERSION: string;
        MODE: 'SANDBOX' | 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
        ENABLE_LOG: boolean;
        ON_DEBUG: boolean;
        ENABLE_PHYSICS_DEBUG: boolean;
        BASE_ASSET_URL: string;
        BASE_API_URL: string;
    }

    namespace General {

        type FunctionWithParams = (...args: unknown[]) => void

        type FunctionNoParam = () => void

        type KeyValuePair<K, V> = {
            key: K;
            value: V;
        }

    }

    namespace Network {

        type ErrorData = {
            origin: string;
            err: any;
        }

        namespace Data {

            type ResultStatus = {
                code: number;
                message: string[];
                reason: string;
            };

            type Profile = {
                user_id: string;
                first_name: string;
                full_name: string;
                email: string;
                phone_masked: string;
                profile_picture: string;
            }

            type GameMilestonesList = {
                resultStatus: ResultStatus;
                milestones: {
                    threshold: number;
                    thresholdStr: string;
                    benefitDescription: string[];
                    iconURL: string;
                    achievedIconURL: string;
                    isAchieved: boolean;
                }[];
            }

            type GameUserData = {
                resultStatus: ResultStatus;
                currentCumulativeScore: number;
                playCount: number;
            }

            type GameDetail = {
                resultStatus: ResultStatus;
                name: string;
                slug: string;
                status: number;
                description: string;
                durationSecond: number,
                leaderboardCampaignID: number,
                liveFeedChannelID: number,
                gameToken: {
                    tokenLeft: number;
                    tokenLeftStr: string;
                    pointCost: number;
                };
                playButton: {
                    state: string;
                    text: string;
                    nextTimeWindowID: number;
                };
                gameInfo: string;
            }

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

    namespace Title {

        type ScreenState = "HOME_SCREEN" | "INFO_SCREEN" | "PICK_CHAR_SCREEN";

    }

}