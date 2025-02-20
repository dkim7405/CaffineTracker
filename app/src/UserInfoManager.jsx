const CAFFEINE_MG_PER_KG = 5;
const LBS_PER_KG = 2.20462;

class UserInfoManager {

    constructor(
        {todayCaffeineIntake = 0,
        bodyWeightLB = 160}
    ) {
        this.todayCaffeineIntake = todayCaffeineIntake;
        this.bodyWeightLB = bodyWeightLB;
        this.safetyLimit = this.getSafetyLimitLB();
    }

    getSafetyLimitLB() {
        let caffeineMgPerLB = CAFFEINE_MG_PER_KG / LBS_PER_KG;
        let accurateSafeLimit = caffeineMgPerLB * this.bodyWeightLB;
        return Math.round(accurateSafeLimit);
    }

    addCaffeine(amount) {
        this.todayCaffeineIntake += amount;
    }
}

export default UserInfoManager;