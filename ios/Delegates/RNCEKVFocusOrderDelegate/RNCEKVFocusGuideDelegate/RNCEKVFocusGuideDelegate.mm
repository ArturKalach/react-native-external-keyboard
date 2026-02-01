//
//  RNCEKVFocusGuideDelegate.m
//  react-native-external-keyboard
//
//  Created by Artur Kalach on 16/07/2025.
//

#import <Foundation/Foundation.h>
#import "RNCEKVFocusGuideDelegate.h"

@implementation RNCEKVFocusGuideDelegate{
  BOOL _isFocused;
  UIView<RNCEKVFocusOrderProtocol>* _delegate;
//  UIFocusGuide *_leftFocusGuide;
//  UIFocusGuide *_rightFocusGuide;
//  UIFocusGuide *_upFocusGuide;
//  UIFocusGuide *_downFocusGuide;
  NSMutableDictionary<NSNumber *, UIFocusGuide*> *_sides;
}

- (instancetype _Nonnull )initWithView:(UIView<RNCEKVFocusOrderProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
    _isFocused = false;
    _sides = [NSMutableDictionary dictionary];
  }
  return self;
}


- (void)setGuideFor:(RNCEKVFocusGuideDirection)direction withView: (UIView *)view {
  if (!view) return;
  
  [self removeGuideFor: direction];
  _sides[@(direction)] = [RNCEKVFocusGuideHelper setGuideForDirection: direction
                                        inView:_delegate
                                     focusView: view
                                       enabled: _isFocused];
}

-(void)removeGuideFor:(RNCEKVFocusGuideDirection)direction {
  if (_sides[@(direction)]) {
    [_delegate removeLayoutGuide: _sides[@(direction)]];
    _sides[@(direction)] = nil;
  }
}

//
//
//- (void)setLeftGuide:(UIView *)view {
//  if (!view) {
//    return;
//  }
//  
//  [self removeLeftGuide];
//  _leftFocusGuide = [RNCEKVFocusGuideHelper setGuideForDirection: RNCEKVFocusGuideDirectionLeft
//                                        inView:_delegate
//                                     focusView:view
//                                       enabled: _isFocused];
//}
//
//
//
//- (void)setRightGuide:(UIView *)view {
//  if (!view) return;
//  
//  [self removeRightGuide];
//  _rightFocusGuide = [RNCEKVFocusGuideHelper setGuideForDirection: RNCEKVFocusGuideDirectionRight
//                                        inView:_delegate
//                                     focusView:view
//                                       enabled: _isFocused];
//}
//
//- (void)setUpGuide:(UIView *)view {
//  if (!view) return;
//  
//  [self removeUpGuide];
//  _upFocusGuide = [RNCEKVFocusGuideHelper setGuideForDirection: RNCEKVFocusGuideDirectionUp
//                                        inView:_delegate
//                                     focusView:view
//                                       enabled: _isFocused];
//}
//
//- (void)setDownGuide:(UIView *)view {
//  if (!view) return;
//  
//  [self removeDownGuide];
//  _downFocusGuide = [RNCEKVFocusGuideHelper setGuideForDirection: RNCEKVFocusGuideDirectionDown
//                                        inView:_delegate
//                                     focusView:view
//                                       enabled: _isFocused];
//}

- (void)setIsFocused:(BOOL)value {
  _isFocused = value;
  
  for (NSNumber *key in _sides) {
      UIFocusGuide* side = _sides[key];
      if(side) {
        side.enabled = value;
      }
  }
//  
//  if(_leftFocusGuide != nil) {
//    _leftFocusGuide.enabled = value;
//  }
//  
//  if(_rightFocusGuide != nil) {
//    _rightFocusGuide.enabled = value;
//  }
//  
//  if(_upFocusGuide != nil) {
//    _upFocusGuide.enabled = value;
//  }
//  
//  if(_downFocusGuide != nil) {
//    _downFocusGuide.enabled = value;
//  }
}
//
//- (void)removeLeftGuide {
//  if (_leftFocusGuide) {
//    [_delegate removeLayoutGuide: _leftFocusGuide];
//    _leftFocusGuide = nil;
//  }
//}
//
//- (void)removeRightGuide {
//  if (_rightFocusGuide) {
//    [_delegate removeLayoutGuide: _rightFocusGuide];
//    _rightFocusGuide = nil;
//  }
//}
//
//- (void)removeUpGuide {
//  if (_upFocusGuide) {
//    [_delegate removeLayoutGuide:_upFocusGuide];
//    _upFocusGuide = nil;
//  }
//}
//
//- (void)removeDownGuide {
//  if (_downFocusGuide) {
//    [_delegate removeLayoutGuide:_downFocusGuide];
//    _downFocusGuide = nil;
//  }
//}

@end
