//
//  RNCEKVGuideMask.mm
//  react-native-external-keyboard
//

#import "RNCEKVGuideMask.h"

@implementation RNCEKVGuideMaskPolicy

- (instancetype)initWithValue:(NSInteger)value
{
  if (self = [super init]) {
    _value = value;
  }
  return self;
}

- (BOOL)hasFlag:(RNCEKVGuideMask)flag
{
  return (_value & flag) != 0;
}

- (BOOL)hasKeyboard
{
  return [self hasFlag:RNCEKVGuideMaskArrows] || [self hasFlag:RNCEKVGuideMaskTab];
}

- (BOOL)hasScreenReader
{
  return [self hasFlag:RNCEKVGuideMaskScreenReader];
}

- (BOOL)redirectsScreenReader:(BOOL)voiceOverRunning
{
  return self.hasScreenReader && (!self.hasKeyboard || voiceOverRunning);
}

- (BOOL)redirectsTab:(BOOL)voiceOverRunning
{
  return [self hasFlag:RNCEKVGuideMaskTab] && !(self.hasScreenReader && voiceOverRunning);
}

@end
