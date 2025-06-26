import { InternalServerErrorException } from 'src/common/exceptions/internal-server-error.exception';

export class StrategyConfigException extends InternalServerErrorException {
  constructor(strategy: string, configName: string) {
    super(
      `[${strategy}] ${configName} 설정이 누락되었습니다.`,
      'STRATEGY_CONFIG_MISSING',
    );
  }
}
