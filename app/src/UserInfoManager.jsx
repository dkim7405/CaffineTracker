/* eslint-disable no-unused-vars */

const caffeineMgPerKg = 5;
// 5 / 2.2 = 2.27
const caffeineMgPerLb = 2.27;

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
        let accurateSafeLimit = this.bodyWeightLB * caffeineMgPerLb;
        return Math.round(accurateSafeLimit);
    }

    addCaffeine(amount) {
        this.todayCaffeineIntake += amount;
    }
}

export default UserInfoManager;