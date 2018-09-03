import { IFeatureName } from './FEATURE_NAME.interface';
// <MongoDB>
import { FeatureNameRepository } from './FEATURE_NAME.repository';

export class FeatureNameManager implements FeatureNameRepository {
    static create(featureName: IFeatureName) {
        return FeatureNameRepository.create(featureName);
    }

    static createMany(featureNames: IFeatureName[]) {
        return FeatureNameRepository.createMany(featureNames);
    }

    static updateById(id: string, featureName: Partial<IFeatureName>) {
        return FeatureNameRepository.updateById(id, featureName);
    }

    static updateMany(featureNameFilter: Partial<IFeatureName>, featureName: Partial<IFeatureName>) {
        return FeatureNameRepository.updateMany(featureNameFilter, featureName);
    }

    static deleteById(id: string) {
        return FeatureNameRepository.deleteById(id);
    }

    static getById(id: string) {
        return FeatureNameRepository.getById(id);
    }

    static getOne(featureNameFilter: Partial<IFeatureName>) {
        return FeatureNameRepository.getOne(featureNameFilter);
    }

    static getMany(featureNameFilter: Partial<IFeatureName>) {
        return FeatureNameRepository.getMany(featureNameFilter);
    }

    static getAmount(featureNameFilter: Partial<IFeatureName>) {
        return FeatureNameRepository.getAmount(featureNameFilter);
    }
}
// </MongoDB>
// !<MongoDB>
export class FeatureNameManager_REMOVE/*MongoDB*/ {
    static async create(featureName: IFeatureName) {
        return { created: featureName.property };
    }
}
// !</MongoDB>
