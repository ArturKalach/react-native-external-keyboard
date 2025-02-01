//
//  RNCEKVGroupIdentifierProtocol.h
//  Pods
//
//  Created by Artur Kalach on 24/01/2025.
//

#ifndef RNCEKVGroupIdentifierProtocol_h
#define RNCEKVGroupIdentifierProtocol_h

#import <Foundation/Foundation.h>

@protocol RNCEKVGroupIdentifierProtocol <NSObject>

- (NSString*) customGroupId;
- (UIView*) getFocusTargetView;

@end

#endif /* RNCEKVGroupIdentifierProtocol_h */
